import mongoose, { Schema, Document } from "mongoose";

interface IResult extends Document {
  username: string;
  nbWords: number;
  nbMistakes: number;
  timer: number;
  date: Date;
}

const ResultSchema: Schema = new Schema({
  username: { type: String, required: true },
  nbWords: { type: Number, required: true },
  nbMistakes: { type: Number, required: true },
  timer: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Result = mongoose.model<IResult>("Result", ResultSchema);

export default Result;
