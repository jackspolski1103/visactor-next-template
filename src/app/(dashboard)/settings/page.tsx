"use client";

import { useState } from "react";
import Container from "@/components/container";
import { InstrumentList } from "./_components/instrument-list";
import { AddInstrumentForm } from "./_components/add-instrument-form";
import { SampleDataCard } from "./_components/sample-data-card";
import type { FinancialInstrument } from "@/types/types";
import { useInstrumentsAPI } from "@/hooks/use-instruments-api";

export default function SettingsPage() {
  const { instruments, addInstrument, updateInstrument, deleteInstrument, loadSampleData, isLoading, error } = useInstrumentsAPI();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState<FinancialInstrument | null>(null);

  const handleAddInstrument = async (instrumentData: Omit<FinancialInstrument, "id" | "addedAt">) => {
    try {
      await addInstrument(instrumentData);
      setIsFormOpen(false);
    } catch {
      // Error is already handled by the hook and displayed in the UI
    }
  };

  const handleEditInstrument = (instrument: FinancialInstrument) => {
    setEditingInstrument(instrument);
    setIsFormOpen(true);
  };

  const handleUpdateInstrument = async (instrumentData: Omit<FinancialInstrument, "id" | "addedAt">) => {
    if (editingInstrument) {
      try {
        await updateInstrument(editingInstrument.id, instrumentData);
        setEditingInstrument(null);
        setIsFormOpen(false);
      } catch {
        // Error is already handled by the hook and displayed in the UI
      }
    }
  };

  const handleDeleteInstrument = async (id: string) => {
    try {
      await deleteInstrument(id);
    } catch {
      // Error is already handled by the hook and displayed in the UI
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingInstrument(null);
  };

  // Show loading state while API is being called
  if (isLoading) {
    return (
      <Container className="py-4">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando configuración...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Gestiona los instrumentos financieros (ISIN, CUSIP, Ticker) para tus dashboards
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Agregar Instrumento
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {instruments.length === 0 && !error && (
          <SampleDataCard onLoadSampleData={loadSampleData} />
        )}

        <InstrumentList
          instruments={instruments}
          onEdit={handleEditInstrument}
          onDelete={handleDeleteInstrument}
        />

        {isFormOpen && (
          <AddInstrumentForm
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={editingInstrument ? handleUpdateInstrument : handleAddInstrument}
            initialData={editingInstrument}
          />
        )}
      </div>
    </Container>
  );
}
