import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './resolvers';
import { useContext } from './context';

(async () => {
    try {
        // tslint:disable-next-line
        console.time("App Start");

        const context = await useContext();
        const { port } = context;
        const server = new ApolloServer({ typeDefs, context, resolvers });

        const { url } = await server.listen({
            port,
        });

        // tslint:disable-next-line
        console.log(`🚀  Server ready at ${url}`);

      } catch (e) {
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
