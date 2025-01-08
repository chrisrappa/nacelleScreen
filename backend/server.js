import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import path from 'path';

const DEFAULT_TIMEOUT = 120000; // Set timeout for 120 seconds

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKeyPath = path.join(__dirname, 'ssl', 'privateKey.pem');
const certificatePath = path.join(__dirname, 'ssl', 'certificate.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const isLocal = process.env.NODE_ENV !== 'production';

const corsOptions = {
  origin: `${process.env.CORS_ORIGIN}`, 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
};

const connectWithRetry = () => {
  console.log('Attempting MongoDB connection...');
  mongoose.connect(`${process.env.MONGODB_URI}`, {
    serverSelectionTimeoutMS: 10000,
  }).then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.error('MongoDB connection failed, retrying...', err);
    setTimeout(connectWithRetry, 1000);
  });
};

connectWithRetry();

app.use(cors(corsOptions))
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({
  limit: "50mb", 
  extended: true, 
  parameterLimit:50000
}));

app.use(bodyParser.text({ limit: '200mb' }));

app.use(express.static(path.join(__dirname, '/../ux/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../ux/build/index.html`));
});

const port = process.env.PORT || (isLocal ? 5001 : 80);

const server = isLocal
  ? http.createServer(credentials, app)
  : http.createServer(app);

server.timeout = DEFAULT_TIMEOUT;

server.listen(port, () => {
  console.log(`Server started at PORT:${port}`);
});