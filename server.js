//imported_settings
import 'dotenv/config'

//important_modules
import express from 'express';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import { fileURLToPath } from 'url';

//security_implementation
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
	
})
//express server
const app = express();
const port = process.env.PORT || 3333;
app.use(helmet());
app.use(limiter);

//db_configs
import sequelize from './config/database.js';
import  User from './model/user.js'

//middleware
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//db_sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");

    await sequelize.sync({ alter: true , force: false}); 
    console.log("✅ Models synced.");

  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
})();

//activity_logger
import morgan from 'morgan';
import fs from 'fs';
import * as rfs from "rotating-file-stream";
const logDirectory = path.join(process.cwd(), "log");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const generator = (time, index) => {
  if (!time) return "access.log";
  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, "0");
  const day = String(time.getDate()).padStart(2, "0");
  return `access-${year}-${month}-${day}.log`;
};
const accessLogStream = rfs.createStream(generator, {
  interval: "1d", // rotate daily
  path: logDirectory,
});
morgan.token("body", (req, res) => {
  return res.locals.body ? JSON.stringify(res.locals.body) : "-";
});
const captureResponseBody = (req, res, next) => {
  const oldJson = res.json;
  res.json = function (data) {
    res.locals.body = data;
    return oldJson.call(this, data);
  };
  next();
};
app.use(captureResponseBody);
app.use(
  morgan(
    ':date[iso] :method :url :status :response-time ms - :res[content-length] :body',
    { stream: accessLogStream }
  )
);

//test_route
app.get('/', (req, res, next) => {
  res.send("Welcome to the server!");
});

//imported_routes
import apiDocsRouter from './route/api-docs.js';
app.use(apiDocsRouter);
import authRoutes from './route/auth.js';
app.use(authRoutes);
import userRoutes from './route/user.js'
app.use(userRoutes)



//server_start
app.listen(port, () => {
  console.log(`✅ Server running on port : ${port}`);
});

export default app;
