// Minimal types used by the app (GraphQL + REST compatible)
export interface Sys {
  id: string;
}

export interface AccordionItemFields {
  internalName?: string;
  name: string;
  text: string;
}

export interface AccordionItem {
  sys: Sys;
  fields: AccordionItemFields;
}

export interface AccordionFields {
  internalName?: string;
  title?: string;
  accordionItems: AccordionItem[];
}

export interface AccordionEntry {
  sys: Sys;
  fields: AccordionFields;
}

export type AccordionData = AccordionEntry[];