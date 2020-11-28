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

    ~~~ js
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

