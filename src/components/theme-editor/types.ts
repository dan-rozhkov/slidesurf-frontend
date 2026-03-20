import type { Theme } from "@/types";

export type ThemeFormData = {
  name: string;
  fontFamily: string;
  fontFamilyHeader?: string;
  backgroundColor: string;
  foregroundColor: string;
  accentColor: string;
  cardBackgroundColor?: string;
  cardForegroundColor?: string;
  cardBorderColor?: string;
  // Table colors
  tableBorderColor?: string;
  tableRowBackground?: string;
  tableHeaderBackground?: string;
  // Smart layout colors
  smartLayoutItem1?: string;
  smartLayoutItem2?: string;
  smartLayoutItem3?: string;
  smartLayoutItem4?: string;
  smartLayoutStatFill?: string;
  smartLayoutStatEmpty?: string;
  smartLayoutBorderColor?: string;
  // Chart colors
  chartColor1?: string;
  chartColor2?: string;
  chartColor3?: string;
  chartColor4?: string;
  chartColor5?: string;
  // Assets
  backgroundImageUrls?: string[];
  slideImageUrls?: string[];
  // Public access
  isPublic: boolean;
};

export type ConvertToTheme = (data: ThemeFormData) => Omit<Theme, "id">;
