import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
};

(async () => {
    try {
        // tslint:disable-next-line
        console.time("App Start");

        const server = new ApolloServer({ typeDefs, resolvers });

        const { url } = await server.listen();

        // tslint:disable-next-line
        console.log(`🚀  Server ready at ${url}`);

      } catch (e) {
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
