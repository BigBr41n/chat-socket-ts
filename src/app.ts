import express from "express";
import path from "path";

//express instance
const app = express();

//static public folder
app.use(express.static(path.join(__dirname, "public")));

export default app;
