import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 8080;

const corsOptions = {
  origin: ["http://localhost:8081"],
};
app.use(cors(corsOptions));

const filePath = path.join(__dirname, "..", "words.txt");
const wordsArray = fs
  .readFileSync(filePath, "utf-8")
  .split("\n")
  .map((word) => word.trim().toLowerCase())
  .filter(Boolean);

const getRandomWords = (words: string[]): string[] => {
  return [...words].sort(() => 0.5 - Math.random());
};

app.get("/api", (req, res) => {
  const randomWords = getRandomWords(wordsArray);
  res.json({ randomWords: randomWords });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
