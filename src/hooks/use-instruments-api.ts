"use client";

import { useState, useEffect } from "react";
import type { FinancialInstrument, InstrumentFormData } from "@/types/types";

export function useInstrumentsAPI() {
  const [instruments, setInstruments] = useState<FinancialInstrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch instruments from server
  const fetchInstruments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch("/api/instruments");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert string dates back to Date objects
      const instrumentsWithDates = data.map((instrument: FinancialInstrument & { addedAt: string }) => ({
        ...instrument,
        addedAt: new Date(instrument.addedAt),
      }));
      
      setInstruments(instrumentsWithDates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch instruments");
      // Error logged for debugging
    } finally {
      setIsLoading(false);
    }
  };

  // Load instruments on component mount
  useEffect(() => {
    fetchInstruments();
  }, []);

  // Add new instrument
  const addInstrument = async (instrumentData: InstrumentFormData) => {
    try {
      setError(null);
      
      const response = await fetch("/api/instruments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(instrumentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add instrument");
      }

      const newInstrument = await response.json();
      
      // Convert addedAt to Date object
      const instrumentWithDate = {
        ...newInstrument,
        addedAt: new Date(newInstrument.addedAt),
      };
      
      setInstruments((prev) => [...prev, instrumentWithDate]);
      return instrumentWithDate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add instrument";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update existing instrument
  const updateInstrument = async (id: string, instrumentData: InstrumentFormData) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/instruments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(instrumentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update instrument");
      }

      const updatedInstrument = await response.json();
      
      // Convert addedAt to Date object
      const instrumentWithDate = {
        ...updatedInstrument,
        addedAt: new Date(updatedInstrument.addedAt),
      };
      
      setInstruments((prev) =>
        prev.map((instrument) =>
          instrument.id === id ? instrumentWithDate : instrument
        )
      );
      
      return instrumentWithDate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update instrument";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete instrument
  const deleteInstrument = async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/instruments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete instrument");
      }

      setInstruments((prev) => prev.filter((instrument) => instrument.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete instrument";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Load sample data (bulk operation)
  const loadSampleData = async (sampleInstruments: FinancialInstrument[]) => {
    try {
      setError(null);
      
      const response = await fetch("/api/instruments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleInstruments),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load sample data");
      }

      // Refresh instruments from server
      await fetchInstruments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load sample data";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Clear all instruments
  const clearAllInstruments = async () => {
    try {
      setError(null);
      
      const response = await fetch("/api/instruments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([]),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to clear instruments");
      }

      setInstruments([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear instruments";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Get instruments by type
  const getInstrumentsByType = (type: FinancialInstrument["type"]) => {
    return instruments.filter((instrument) => instrument.type === type);
  };

  // Refresh data from server
  const refreshInstruments = () => {
    fetchInstruments();
  };

  return {
    instruments,
    isLoading,
    error,
    addInstrument,
    updateInstrument,
    deleteInstrument,
    getInstrumentsByType,
    loadSampleData,
    clearAllInstruments,
    refreshInstruments,
  };
}
