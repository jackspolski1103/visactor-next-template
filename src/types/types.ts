import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type TicketMetric = {
  date: string;
  type: "created" | "resolved";
  count: number;
};

// Financial instrument types
export type InstrumentType = "ISIN" | "CUSIP" | "TICKER";

export type FinancialInstrument = {
  id: string;
  type: InstrumentType;
  code: string;
  name: string;
  description?: string;
  addedAt: Date;
};

export type InstrumentFormData = Omit<FinancialInstrument, "id" | "addedAt">;
