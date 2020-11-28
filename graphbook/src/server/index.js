import helmet from 'helmet'; // secures HTTP headers
import express from 'express';
import path from 'path';
const app = express();  // initialize server
import cors from 'cors'; // provides Cross-origin-resource sharing
import compress from 'compression'; // compresses responses to save on bandwidth


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


app.listen(8000, () => console.log(' Listening on port 8000!'));
