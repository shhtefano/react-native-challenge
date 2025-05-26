import { spawn } from "child_process";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/nickname", (req, res) => {
  console.log("Richiesta ricevuta:", req.body);
  if (!req.body.prompt) {
    return res.status(400).json({ error: "Prompt mancante" });
  }
  const prompt = `Genera 5 nickname e restituiscili in un array JSON in questo modo: ${req.body.prompt}`  || "Genera 5 nickname e restituiscili in un array JSON";
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