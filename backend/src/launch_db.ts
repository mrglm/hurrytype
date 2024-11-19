import fs from "fs";
import { exec } from "child_process";
import path from "path";

const dbPath = path.join(__dirname, "..", "db");

if (!fs.existsSync(dbPath)) {
  console.log("Creating 'db' directory...");
  fs.mkdirSync(dbPath, { recursive: true });
  console.log("'db' directory created.");
} else {
  console.log("'db' directory already exists.");
}

console.log("Starting MongoDB...");
const mongodProcess = exec(`mongod --dbpath ${dbPath} --port 8082`);

mongodProcess.on("close", (code) => {
  console.log(`MongoDB process exited with code ${code}`);
});
