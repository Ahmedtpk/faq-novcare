import { createClient } from "contentful";
import { GraphQLClient } from "graphql-request";

// Create REST client
export const restClient = createClient({
  space: process.env.CONTENTFUL_SPACE!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT,
});

// Create GraphQL client
const graphqlEndpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE}/environments/${process.env.CONTENTFUL_ENVIRONMENT ?? "master"}`;

export const graphqlClient = new GraphQLClient(graphqlEndpoint, {
  headers: {
    Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN!}`,
  },
});

// GraphQL query
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

// Type for the raw GraphQL response
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

// Main function to fetch FAQs
export async function getFAQs(): Promise<GraphQLFaqsResponse['accordionCollection']> {
  // Try GraphQL first
  try {
    const data = await graphqlClient.request<GraphQLFaqsResponse>(FAQS_QUERY);
    return data.accordionCollection;
  } catch (graphqlError) {
    console.warn("GraphQL fetch failed, falling back to REST:", graphqlError);
  }

  // Fallback to REST API
  try {
    const response = await restClient.getEntries({
      content_type: "accordion",
      include: 2,
    });

    // Transform REST response to match GraphQL structure
    return {
      items: response.items.map((item: any) => ({
        sys: { id: item.sys.id },
        title: item.fields.title,
        internalName: item.fields.internalName,
        accordionItemsCollection: {
          items: (item.fields.accordionItems || []).map((subItem: any) => ({
            sys: { id: subItem.sys.id },
            name: subItem.fields.name,
            text: subItem.fields.text,
            internalName: subItem.fields.internalName,
          })),
        },
      })),
    };
  } catch (restError) {
    console.error("Both GraphQL and REST fetches failed:", restError);
    return { items: [] };
  }
}