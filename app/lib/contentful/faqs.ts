import { ContentfulAccordionEntry, ContentfulFaqsResponse} from "@/types/contentful/accordion";
import { requestContentfulGraphQL } from "./core";

export const FAQS_QUERY = `
  query Faqs {
    accordionCollection(limit: 10) {
      items {
        sys { id }
        title
        internalName
        accordionItemsCollection(limit: 50) {
          items {
            sys { id }
            name
            text
            internalName
          }
        }
      }
    }
  }
`;

export async function getFAQs(): Promise<ContentfulAccordionEntry[]> {
  try {
    const data = await requestContentfulGraphQL<ContentfulFaqsResponse>(FAQS_QUERY);
    return data.accordionCollection?.items ?? [];
  } catch (error) {
    console.error("Failed to fetch FAQs from GraphQL:", error);
    return [];
  }
}