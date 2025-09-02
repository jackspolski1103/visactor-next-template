"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import type { FinancialInstrument, InstrumentFormData } from "@/types/types";

type StoredInstrument = Omit<FinancialInstrument, "addedAt"> & { addedAt: string };

export function useInstruments() {
  const [storedInstruments, setStoredInstruments, isLoaded] = useLocalStorage<StoredInstrument[]>("financial_instruments", []);

  // Convert stored instruments (with string dates) to FinancialInstruments (with Date objects)
  const instruments: FinancialInstrument[] = storedInstruments.map(instrument => ({
    ...instrument,
    addedAt: new Date(instrument.addedAt),
  }));

  const addInstrument = (instrumentData: InstrumentFormData) => {
    const newInstrument: StoredInstrument = {
      id: crypto.randomUUID(),
      ...instrumentData,
      addedAt: new Date().toISOString(),
    };
    setStoredInstruments((prev) => [...prev, newInstrument]);
  };

  const updateInstrument = (id: string, instrumentData: InstrumentFormData) => {
    setStoredInstruments((prev) =>
      prev.map((instrument) =>
        instrument.id === id
          ? { ...instrument, ...instrumentData }
          : instrument
      )
    );
  };

  const deleteInstrument = (id: string) => {
    setStoredInstruments((prev) => prev.filter((instrument) => instrument.id !== id));
  };

  const getInstrumentsByType = (type: FinancialInstrument["type"]) => {
    return instruments.filter((instrument) => instrument.type === type);
  };

  const loadSampleData = (sampleInstruments: FinancialInstrument[]) => {
    const storedSampleData: StoredInstrument[] = sampleInstruments.map(instrument => ({
      ...instrument,
      addedAt: instrument.addedAt.toISOString(),
    }));
    setStoredInstruments(storedSampleData);
  };

  const clearAllInstruments = () => {
    setStoredInstruments([]);
  };

  return {
    instruments,
    addInstrument,
    updateInstrument,
    deleteInstrument,
    getInstrumentsByType,
    loadSampleData,
    clearAllInstruments,
    isLoaded,
  };
}
