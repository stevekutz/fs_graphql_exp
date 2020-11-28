## Graphbook Project

####A Full Stack Facebook clone built upon:

1) React - A UI Component Library for building graphical interfaces
2) Express - A JS framework for backend operations run on a Node.js platform
3) GraphQL - A query language used to create API architecture
4) MySQL - A Relational database
5) Apollo - Client/server for managing GraphQL and caching
6) Sequelize - A Promise-based Node.js ORM(Object Relational Mapping tool

Other configuration details:

1) A webpack configuration file is used to bundle modules
2) Babel is used to transpile the JavaScript files
3) The Airbnb eslint config is used


##### The server is set up using Express and middleware

- note that helmet is initialized first the router config
- The following are run to set up express and middleware
- Once complete, the server is launched  using `npm run server`
- Create `src/server/index.js for the express server`

    ~~~ bash
    npm install --save express
    npm install --save nodemon   
    npm install --save -dev @babel/node
    npm install --save compression cors helmet
    ~~~

    ~~~ js
    // index.js
    import helmet from 'helmet'; // secures HTTP headers
    import express from 'express';
    import path from 'path';
    const app = express();  // initialize server
    import cors from 'cors'; // provides Cross-origin-resource sharing
    import compress from 'compression'; // compresses responses to save on bandwidth

    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({   // prevents loading of external URL resources 
    directives: {
        defaultSrc: ["'self"],
        scriptSrc: ["'self", "'unsafe-inline"],
        styleSrc: ["'self", "'unsafe-inline"],
        imgSrc: ["'self'", "data:", "*amazonaws.com"] // only allows images uploaded from Amazon AWS
    }
    }));
    app.use(helmet.referrerPolicy({policy: 'same-origin'}));
    app.use(compress());
    app.use(cors());



    const root = path.join(__dirname, '../../');

    app.use('/', express.static(path.join(root, 'dist/client')));
    app.use('/uploads', express.static(path.join(root, 'uploads')));
    app.get('/', (req, res) => {
    res.sendFile(path.join(root, '/dist/client/index.html'));
    });
    ~~~

##### GraphQL is set up with Apollo server

Apollo server integrates well with Express middleware

- install dependencies

    ~~~ bash 
    npm install --save apollo-server-express graphql graphql-tools
    ~~~


- Set up a `services` and `services/graphql` folder



###### services/graphql/index.js
- `makeExecutableSchema` merges resolver functions and schema from GraphQL
- `context` includes Express request obj

    ~~~ js
    import {ApolloServer, SchemaDirectiveVisitor} from 'apollo-server-express';
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
        context: ({request}) => request
    })

    export default server;
    ~~~

###### services/index.js

- takes all resources from graphql folder and merges them into a single 

    ~~~ js
    import graphql from './graphql';

    // takes all resources from graphql folder and merges them into a single obj
    export default {graphql};
    ~~~

###### server/index.js

- add the following:
- `applyMiddleWare` lets Apollo Server bind to Express server without interference from the `use function from Express`

    ~~~ js
    import services from './services'; // holds the graphql index

    ...


    // binds GraphQL server to Express server
    const serviceNames = Object.keys(services);

    for(let i = 0; i < serviceNames.length; i ++) {
        const name = serviceNames[i];

        if (name === 'graphql') {
            services[name].applyMiddleware({app});
        }
        else {
            app.use(`/${name}`, services[name]);
        }
    }

    ~~~

###### services/graphql/schema.js

- the `Post` query simply defines Post fields
- the  `RootQuery` returns all available posts
- the schema is exported as an array

    ~~~ js
    const typeDefinitions = `
        type Post {
            id: Int
            text: String
        }
        
        type RootQuery {
            posts: [Post]
        }

        schema {
            query: RootQuery
        }

    `;

    export default [typeDefinitions];
    ~~~

###### services/graphql/resolvers.js 

- A resolver can optionally accept four positional arguments: (parent, args, context, info)
- A resolver is a function that is responsible for providing data for a single field from the schema

    ~~~ js
    const resolvers = {
        RootQuery: {
            posts(root, args, context) {
                return []
            },    
        },
    };

    export default resolvers;
    ~~~