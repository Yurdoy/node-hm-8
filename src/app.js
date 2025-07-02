import express from "express";
import "dotenv/config";
import sequelize from "./config/db.js";
import Book from "./models/book.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, sequelize with Express");
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.send(500).json(error);
  }
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connection to the database has been established successfully`);
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
});
