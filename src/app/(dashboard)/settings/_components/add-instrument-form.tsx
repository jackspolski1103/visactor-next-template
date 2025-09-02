"use client";

import { useState, useEffect } from "react";
import type { FinancialInstrument, InstrumentType, InstrumentFormData } from "@/types/types";
import { X } from "lucide-react";

interface AddInstrumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InstrumentFormData) => void;
  initialData?: FinancialInstrument | null;
}

export function AddInstrumentForm({ isOpen, onClose, onSubmit, initialData }: AddInstrumentFormProps) {
  const [formData, setFormData] = useState<InstrumentFormData>({
    type: "TICKER",
    code: "",
    name: "",
    description: "",
  });

  // Reset form when opening/closing or when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        code: initialData.code,
        name: initialData.name,
        description: initialData.description || "",
      });
    } else {
      setFormData({
        type: "TICKER",
        code: "",
        name: "",
        description: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.code.trim() && formData.name.trim()) {
      onSubmit({
        ...formData,
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      });
    }
  };

  const handleChange = (field: keyof InstrumentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getCodePlaceholder = () => {
    switch (formData.type) {
      case "ISIN":
        return "Ej: US0378331005";
      case "CUSIP":
        return "Ej: 037833100";
      case "TICKER":
        return "Ej: AAPL";
      default:
        return "";
    }
  };

  const getCodePattern = () => {
    switch (formData.type) {
      case "ISIN":
        return "[A-Z]{2}[A-Z0-9]{9}[0-9]"; // ISIN format
      case "CUSIP":
        return "[A-Z0-9]{9}"; // CUSIP format
      case "TICKER":
        return "[A-Z]{1,5}"; // Ticker format (1-5 letters)
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {initialData ? "Editar Instrumento" : "Agregar Instrumento"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tipo de Instrumento
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value as InstrumentType)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="TICKER">Ticker Symbol</option>
              <option value="ISIN">ISIN</option>
              <option value="CUSIP">CUSIP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Código
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
              placeholder={getCodePlaceholder()}
              pattern={getCodePattern()}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.type === "ISIN" && "Formato: 2 letras del país + 9 caracteres alfanuméricos + 1 dígito de control"}
              {formData.type === "CUSIP" && "Formato: 9 caracteres alfanuméricos"}
              {formData.type === "TICKER" && "Formato: 1-5 letras (símbolo bursátil)"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ej: Apple Inc."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Descripción adicional del instrumento..."
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.code.trim() || !formData.name.trim()}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {initialData ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
