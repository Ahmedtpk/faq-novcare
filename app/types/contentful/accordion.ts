export interface ContentfulSys {
  id?: string;
}

export interface ContentfulAccordionItem {
  sys?: ContentfulSys;
  internalName?: string;
  name?: string;
  text?: string;
}

export interface ContentfulAccordionEntry {
  sys?: ContentfulSys;
  title?: string;
  internalName?: string;
  accordionItemsCollection?: {
    items?: ContentfulAccordionItem[];
  };
}

export interface ContentfulFaqsResponse {
  accordionCollection?: {
    items?: ContentfulAccordionEntry[];
  };
}