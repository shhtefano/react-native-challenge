import { spawn } from "child_process";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/nickname", (req, res) => {
  const prompt = req.body.prompt || "Genera 5 nickname originali";
  const ollama = spawn("ollama", ["run", "llama3"], {
    stdio: ["pipe", "pipe", "inherit"],
  });

  ollama.stdin.write(prompt);
  ollama.stdin.end();

  let output = "";
  ollama.stdout.on("data", (data) => {
    output += data.toString();
  });

  ollama.stdout.on("end", () => {
    res.json({ response: output });
  });
});

app.listen(3001, () => {
  console.log("API Ollama attiva su http://localhost:3001");
});