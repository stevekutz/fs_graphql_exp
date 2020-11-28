import express from 'express';
import helmet from 'helmet'; // secures HTTP headers
import path from 'path';
import cors from 'cors'; // provides Cross-origin-resource sharing
import compress from 'compression'; // compresses responses to save on bandwidth
import services from './services'; // holds the graphql index

const root = path.join(__dirname, '../../');
const app = express();  // initialize server
// basic sserver setup
// app.get('*', (req, res) => res.send('Hello World !'));
// app.listen(8000, () => console.log(' Listening on port 8000!'));


// another example server
// app.get('/', function(req, res, next) {
//     console.log('first func');
//     next();
// }, (req, res, next) => {
//     console.log("second func as arrow");
//     next();
// }, function(req, res) {
//     console.log('LAST func \n');
//     res.send("Hello World again!! ");
// });

if(process.env.NODE_ENV === 'development') {
    // middleware
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({   // prevents loading of external URL resources 
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self", "'unsafe-inline"],
            styleSrc: ["'self", "'unsafe-inline"],
            imgSrc: ["'self'", "data:", "*amazonaws.com"] // only allows images uploaded from Amazon AWS
        }
    }));
    app.use(helmet.referrerPolicy({policy: 'same-origin'}));
    app.use(compress());
    app.use(cors());
}

// app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));


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



// app.use('/', express.static(path.join(root, 'dist/client')));
// app.use('/uploads', express.static(path.join(root, 'uploads')));
app.get('/', (req, res) => {
    res.sendFile(path.join(root, '/dist/client/index.html'));
});


app.listen(8000, () => console.log(' Listening on port 8000!'));
