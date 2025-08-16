import 'dotenv/config'

import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';


const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());/* 
app.use(express.static(path.join(__dirname, 'public'))); */

app.get('/', (req, res, next) => {
  res.send("Welcome to the server!");
});

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});

export default app;
