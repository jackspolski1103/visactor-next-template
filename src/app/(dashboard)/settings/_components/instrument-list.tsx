"use client";

import type { FinancialInstrument } from "@/types/types";
import { Edit2, Trash2, TrendingUp } from "lucide-react";

interface InstrumentListProps {
  instruments: FinancialInstrument[];
  onEdit: (instrument: FinancialInstrument) => void;
  onDelete: (id: string) => void;
}

export function InstrumentList({ instruments, onEdit, onDelete }: InstrumentListProps) {
  const getTypeColor = (type: FinancialInstrument["type"]) => {
    switch (type) {
      case "ISIN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "CUSIP":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "TICKER":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (instruments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No hay instrumentos configurados
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
          Agrega tu primer instrumento financiero (ISIN, CUSIP o Ticker) para empezar a crear dashboards
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-foreground">
        Instrumentos Configurados ({instruments.length})
      </h2>
      
      <div className="grid gap-4">
        {instruments.map((instrument) => (
          <div
            key={instrument.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                    instrument.type
                  )}`}
                >
                  {instrument.type}
                </span>
              </div>
              
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-foreground truncate">
                  {instrument.name}
                </h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {instrument.code}
                </p>
                {instrument.description && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {instrument.description}
                  </p>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                Agregado: {instrument.addedAt.toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(instrument)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
                title="Editar instrumento"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => {
                  if (confirm(`¿Estás seguro de que quieres eliminar ${instrument.name}?`)) {
                    onDelete(instrument.id);
                  }
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-destructive hover:text-destructive-foreground h-8 w-8"
                title="Eliminar instrumento"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
