import 'dotenv/config'

import express from 'express';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = process.env.PORT || 3333;


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res, next) => {
  res.send("Welcome to the server!");
});

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});

export default app;
