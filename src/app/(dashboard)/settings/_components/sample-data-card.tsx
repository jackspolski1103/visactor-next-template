"use client";

import { useState } from "react";
import { sampleInstruments } from "@/data/sample-instruments";
import type { FinancialInstrument } from "@/types/types";

interface SampleDataCardProps {
  onLoadSampleData: (instruments: FinancialInstrument[]) => Promise<void>;
}

export function SampleDataCard({ onLoadSampleData }: SampleDataCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadSampleData = async () => {
    setIsLoading(true);
    
    try {
      await onLoadSampleData(sampleInstruments);
    } catch {
      // Error handling is done at the parent level
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
            ¿Quieres probar con datos de ejemplo?
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
            Carga algunos instrumentos financieros de ejemplo (AAPL, MSFT, GOOGL, TSLA) para 
            familiarizarte con la funcionalidad antes de agregar los tuyos.
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <button
            onClick={handleLoadSampleData}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:text-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Cargando..." : "Cargar Ejemplos"}
          </button>
        </div>
      </div>
    </div>
  );
}

