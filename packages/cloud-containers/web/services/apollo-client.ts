import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://data.crystallography.io/graphql",
  cache: new InMemoryCache(),
});
