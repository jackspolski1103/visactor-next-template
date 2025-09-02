import type { FinancialInstrument } from "@/types/types";

export const sampleInstruments: FinancialInstrument[] = [
  {
    id: "1",
    type: "TICKER",
    code: "AAPL",
    name: "Apple Inc.",
    description: "Tecnología - Dispositivos electrónicos y software",
    addedAt: new Date("2024-01-15T10:30:00Z"),
  },
  {
    id: "2", 
    type: "ISIN",
    code: "US0378331005",
    name: "Apple Inc.",
    description: "ISIN code for Apple Inc. common stock",
    addedAt: new Date("2024-01-16T14:20:00Z"),
  },
  {
    id: "3",
    type: "TICKER", 
    code: "MSFT",
    name: "Microsoft Corporation",
    description: "Tecnología - Software y servicios en la nube",
    addedAt: new Date("2024-01-17T09:15:00Z"),
  },
  {
    id: "4",
    type: "TICKER",
    code: "GOOGL", 
    name: "Alphabet Inc. Class A",
    description: "Tecnología - Motor de búsqueda y publicidad digital",
    addedAt: new Date("2024-01-18T16:45:00Z"),
  },
  {
    id: "5",
    type: "CUSIP",
    code: "037833100",
    name: "Apple Inc.",
    description: "CUSIP code for Apple Inc. common stock",
    addedAt: new Date("2024-01-19T11:30:00Z"),
  },
  {
    id: "6",
    type: "TICKER",
    code: "TSLA",
    name: "Tesla, Inc.", 
    description: "Automotriz - Vehículos eléctricos y energía renovable",
    addedAt: new Date("2024-01-20T13:00:00Z"),
  },
];

