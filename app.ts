import express from "express";
import bodyParser from "body-parser";
import {expressRouter} from "./routes/items";
import {config} from "dotenv";

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(bodyParser.json());
app.use('/items', expressRouter);

//Root route
app.get("/", (req, res) => {
    res.json({ message: 'Welcome to the Toge Items Service API' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});