import express from "express";
import Result from "../models/Result";

const router = express.Router();

router.get("/results", async (_req, res) => {
  try {
    const results = await Result.find();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch result : ${error}` });
  }
});

router.post("/results", async (req, res) => {
  try {
    const { username, nbWords, nbMistakes, timer } = req.body.params;
    const newResult = new Result({ username, nbWords, nbMistakes, timer });
    await newResult.save();
    res.status(201).json({ message: "Result saved successfully" });
  } catch (error) {
    res.status(500).json({ error: `Failed to save result : ${error}` });
  }
});

export default router;
