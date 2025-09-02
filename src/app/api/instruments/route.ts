import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { FinancialInstrument, InstrumentFormData } from "@/types/types";

const DATA_FILE = path.join(process.cwd(), "data", "instruments.json");

// Ensure data directory and file exist
async function ensureDataFile() {
  try {
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    // Check if file exists, if not create it with empty array
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, "[]", "utf8");
    }
  } catch {
    // Silently handle error ensuring data file
  }
}

// Read instruments from file
async function readInstruments(): Promise<FinancialInstrument[]> {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, "utf8");
    const instruments = JSON.parse(data);
    
    // Convert string dates back to Date objects
    return instruments.map((instrument: FinancialInstrument & { addedAt: string }) => ({
      ...instrument,
      addedAt: new Date(instrument.addedAt),
    }));
  } catch {
    // Return empty array on read error
    return [];
  }
}

// Write instruments to file
async function writeInstruments(instruments: FinancialInstrument[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(instruments, null, 2), "utf8");
}

// GET /api/instruments - Get all instruments
export async function GET() {
  try {
    const instruments = await readInstruments();
    return NextResponse.json(instruments);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch instruments" },
      { status: 500 }
    );
  }
}

// POST /api/instruments - Create new instrument
export async function POST(request: NextRequest) {
  try {
    const body: InstrumentFormData = await request.json();
    
    // Validate required fields
    if (!body.type || !body.code || !body.name) {
      return NextResponse.json(
        { error: "Missing required fields: type, code, name" },
        { status: 400 }
      );
    }

    const instruments = await readInstruments();
    
    // Check if instrument with same code and type already exists
    const exists = instruments.some(
      (instrument) => instrument.code === body.code && instrument.type === body.type
    );
    
    if (exists) {
      return NextResponse.json(
        { error: "Instrument with this code and type already exists" },
        { status: 409 }
      );
    }

    // Create new instrument
    const newInstrument: FinancialInstrument = {
      id: crypto.randomUUID(),
      type: body.type,
      code: body.code.toUpperCase(),
      name: body.name,
      description: body.description,
      addedAt: new Date(),
    };

    instruments.push(newInstrument);
    await writeInstruments(instruments);

    return NextResponse.json(newInstrument, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create instrument" },
      { status: 500 }
    );
  }
}

// PUT /api/instruments - Update multiple instruments (bulk operations)
export async function PUT(request: NextRequest) {
  try {
    const body: FinancialInstrument[] = await request.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected array of instruments" },
        { status: 400 }
      );
    }

    await writeInstruments(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update instruments" },
      { status: 500 }
    );
  }
}
