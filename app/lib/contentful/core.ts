import { GraphQLClient, Variables } from "graphql-request";

type ContentfulConfig = {
  accessToken: string;
  space: string;
  environment: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getContentfulConfig(): ContentfulConfig {
  return {
    accessToken: getRequiredEnv("CONTENTFUL_ACCESS_TOKEN"),
    space: getRequiredEnv("CONTENTFUL_SPACE"),
    environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
  };
}

const config = getContentfulConfig();

const graphqlEndpoint = `https://graphql.contentful.com/content/v1/spaces/${config.space}/environments/${config.environment}`;

export const graphqlClient = new GraphQLClient(graphqlEndpoint, {
  headers: {
    Authorization: `Bearer ${config.accessToken}`,
  },
});

export async function requestContentfulGraphQL<TResponse>(
  query: string,
  variables?: Variables
): Promise<TResponse> {
  return graphqlClient.request<TResponse>(query, variables);
}
