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
  origin: 'https://udaan-frontend.onrender.com',  //URL of your React app
  credentials: true,  
  optionsSuccessStatus: 200 
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
