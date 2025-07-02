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

app.get("/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findOne({ where: { id: id } });

    if (book) {
      return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

app.post("/books", async (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    res.status(404).json({ message: "All fields are required" });
  }
  const book = await Book.create({ title, author, year });
  res.status(201).json({ message: "Book was successfully created", book });
});

app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    res.status(404).json({ message: "All fields are required" });
  }

  try {
    const [updated] = await Book.update(
      { title, author, year },
      {
        where: { id: id },
      }
    );
    if (updated) {
      const updatedBook = await Book.findOne({ where: { id: id } });
      return res
        .status(200)
        .json({ message: "Book updated successfully", book: updatedBook });
    }
    throw new Error("Book not found");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Book.destroy({
      where: { id: id },
    });

    if (deleted) {
      return res.status(204).send();
    }
    throw new Error("Book not found");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
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
