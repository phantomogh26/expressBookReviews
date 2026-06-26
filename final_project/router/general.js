const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 7 – Register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Task 2 – Get all books (async/await)
public_users.get('/', async (req, res) => {
  try {
    const allBooks = await new Promise((resolve) => resolve(books));
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 3 – Get by ISBN (async/await)
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const book = await new Promise((resolve, reject) => {
      const result = books[req.params.isbn];
      result ? resolve(result) : reject(new Error("Book not found"));
    });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Task 4 – Get by Author (async/await)
public_users.get('/author/:author', async (req, res) => {
  try {
    const result = await new Promise((resolve) => {
      const filtered = Object.values(books).filter(
        b => b.author.toLowerCase() === req.params.author.toLowerCase()
      );
      resolve(filtered);
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 5 – Get by Title (async/await)
public_users.get('/title/:title', async (req, res) => {
  try {
    const result = await new Promise((resolve) => {
      const filtered = Object.values(books).filter(
        b => b.title.toLowerCase() === req.params.title.toLowerCase()
      );
      resolve(filtered);
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 6 – Get book review
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;