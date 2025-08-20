//imported_settings
import 'dotenv/config'

//important_modules
import express from 'express';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import { fileURLToPath } from 'url';

//express server
const app = express();
const port = process.env.PORT || 3333;

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
import { authenticateJWT } from './middleware/auth.js';


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


//imported_routes
import apiDocsRouter from './route/api-docs.js';
app.use(apiDocsRouter);
import authRoutes from './route/auth.js';
app.use(authRoutes);
import userRoutes from './route/user.js'
app.use(userRoutes)

//test_route
app.get('/', (req, res, next) => {
  res.send("Welcome to the server!");
});

//server_start
app.listen(port, () => {
  console.log(`✅ Server running on port : ${port}`);
});

export default app;
