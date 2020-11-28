import {ApolloServer} from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools';
import Resolvers from './resolvers';
import Schema from './schema';


// makeExecutableSchema` merges resolver functions and schema from GraphQL
const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers,
});


// context includes Express request obj
const server = new ApolloServer({
    schema: executableSchema,
    context: ({req}) => req
})

export default server;