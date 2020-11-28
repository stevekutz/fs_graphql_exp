import express from 'express';
const app = express();  // initialize server

app.get('*', (req, res) => res.send('Hello World !'));
app.listen(8000, () => console.log(' Listening on port 8000!'));


