import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { FinancialInstrument, InstrumentFormData } from "@/types/types";

const DATA_FILE = path.join(process.cwd(), "data", "instruments.json");

// Read instruments from file
async function readInstruments(): Promise<FinancialInstrument[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    const instruments = JSON.parse(data);
    
    // Convert string dates back to Date objects
    return instruments.map((instrument: FinancialInstrument & { addedAt: string }) => ({
      ...instrument,
      addedAt: new Date(instrument.addedAt),
    }));
  } catch {
    return [];
  }
}

// Write instruments to file
async function writeInstruments(instruments: FinancialInstrument[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(instruments, null, 2), "utf8");
}

// GET /api/instruments/[id] - Get specific instrument
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const instruments = await readInstruments();
    const instrument = instruments.find((i) => i.id === resolvedParams.id);
    
    if (!instrument) {
      return NextResponse.json(
        { error: "Instrument not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(instrument);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch instrument" },
      { status: 500 }
    );
  }
}

// PUT /api/instruments/[id] - Update specific instrument
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body: InstrumentFormData = await request.json();
    
    // Validate required fields
    if (!body.type || !body.code || !body.name) {
      return NextResponse.json(
        { error: "Missing required fields: type, code, name" },
        { status: 400 }
      );
    }

    const instruments = await readInstruments();
    const instrumentIndex = instruments.findIndex((i) => i.id === resolvedParams.id);
    
    if (instrumentIndex === -1) {
      return NextResponse.json(
        { error: "Instrument not found" },
        { status: 404 }
      );
    }

    // Check if another instrument with same code and type already exists (excluding current one)
    const exists = instruments.some(
      (instrument, index) => 
        index !== instrumentIndex &&
        instrument.code === body.code && 
        instrument.type === body.type
    );
    
    if (exists) {
      return NextResponse.json(
        { error: "Another instrument with this code and type already exists" },
        { status: 409 }
      );
    }

    // Update instrument
    const updatedInstrument: FinancialInstrument = {
      ...instruments[instrumentIndex],
      type: body.type,
      code: body.code.toUpperCase(),
      name: body.name,
      description: body.description,
    };

    instruments[instrumentIndex] = updatedInstrument;
    await writeInstruments(instruments);

    return NextResponse.json(updatedInstrument);
  } catch {
    return NextResponse.json(
      { error: "Failed to update instrument" },
      { status: 500 }
    );
  }
}

// DELETE /api/instruments/[id] - Delete specific instrument
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const instruments = await readInstruments();
    const instrumentIndex = instruments.findIndex((i) => i.id === resolvedParams.id);
    
    if (instrumentIndex === -1) {
      return NextResponse.json(
        { error: "Instrument not found" },
        { status: 404 }
      );
    }

    const deletedInstrument = instruments[instrumentIndex];
    instruments.splice(instrumentIndex, 1);
    await writeInstruments(instruments);

    return NextResponse.json(deletedInstrument);
  } catch {
    return NextResponse.json(
      { error: "Failed to delete instrument" },
      { status: 500 }
    );
  }
}
