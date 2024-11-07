import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import resultRoutes from "./routes/results";

const app = express();
const PORT = 8080;

const corsOptions = {
  origin: ["http://localhost:8081"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/api", resultRoutes);

const filePath = path.join(__dirname, "..", "words.txt");
const wordsArray = fs
  .readFileSync(filePath, "utf-8")
  .split("\n")
  .map((word) => word.trim().toLowerCase())
  .filter(Boolean);

const getRandomWords = (words: string[]): string[] => {
  return [...words].sort(() => 0.5 - Math.random());
};

app.get("/api/words", (_req, res) => {
  const randomWords = getRandomWords(wordsArray);
  res.json({ randomWords: randomWords });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const mongoURI = "mongodb://localhost:8082/db";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
