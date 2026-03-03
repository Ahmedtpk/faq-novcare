import { createClient } from "contentful";
import { GraphQLClient } from "graphql-request";
import { AccordionEntry } from "../types/contentful/accordion";

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT,
});

const graphqlEndpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE}/environments/${process.env.CONTENTFUL_ENVIRONMENT ?? "master"}`;

const graphqlClient = new GraphQLClient(graphqlEndpoint, { headers: {Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,},
});

const FAQS_QUERY = `
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

type GraphQLFaqsResponse = {
  accordionCollection?: {
    items?: Array<{
      sys?: { id?: string };
      title?: string;
      internalName?: string;
      accordionItemsCollection?: {
        items?: Array<{
          sys?: { id?: string };
          name?: string;
          text?: string;
          internalName?: string;
        }>;
      };
    }>;
  };
};

async function getFAQsFromGraphql(): Promise<AccordionEntry[]> {
  const data = await graphqlClient.request<GraphQLFaqsResponse>(FAQS_QUERY);
  const items = data.accordionCollection?.items ?? [];

  return items
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      sys: { id: item.sys?.id ?? "" },
      fields: {
        title: item.title ?? "",
        internalName: item.internalName ?? "",
        accordionItems: (item.accordionItemsCollection?.items ?? [])
          .filter((accordionItem): accordionItem is NonNullable<typeof accordionItem> =>
            Boolean(accordionItem)
          )
          .map((accordionItem) => ({
            sys: { id: accordionItem.sys?.id ?? "" },
            fields: {
              name: accordionItem.name ?? "",
              text: accordionItem.text ?? "",
              internalName: accordionItem.internalName ?? "",
            },
          })),
      },
    }));
}

// Funksjon for å hente FAQ-data med riktige typer
export async function getFAQs(): Promise<AccordionEntry[]> {
  try {
    return await getFAQsFromGraphql();
  } catch (error) {
    console.error("GraphQL fetch failed, falling back to REST:", error);
  }

  const response = await client.getEntries({
    content_type: "accordion",
    include: 2,
  });

  if (!response) {
    return [];
  }

  return response.items as AccordionEntry[] | [];
}