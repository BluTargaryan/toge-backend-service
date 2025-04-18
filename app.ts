import express from "express";
import bodyParser from "body-parser";
import {ingredientsRouter} from "./routes/ingredients";
import {shopsRouter} from "./routes/shops";
import {config} from "dotenv";

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(bodyParser.json());
app.use('/ingredients', ingredientsRouter);
app.use('/shops', shopsRouter);

//Root route
app.get("/", (req, res) => {
    res.json({ message: 'Welcome to the Toge Backend Service API' });
});
app.get("/ingredients", (req, res) => {
    res.json({ message: 'Welcome to the Toge Ingredients Service API' });
});
app.get("/shops", (req, res) => {
    res.json({ message: 'Welcome to the Toge Shops Service API' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});