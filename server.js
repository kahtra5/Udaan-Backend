import express from "express";
import cookieParser from 'cookie-parser';
import apiRouter from "./routes/index.js";
import { connectToMongoDB } from "./config/_mongodb.js";
import errorHandler from "./middleware/errorHandler.js";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = 3000;

const corsOptions = {
  origin: 'https://udaan-frontend1.onrender.com',  // This should match the URL of your React app
  credentials: true,  // This is important to include credentials
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));


app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

await connectToMongoDB();
app.use("/", apiRouter);
app.use(errorHandler);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
