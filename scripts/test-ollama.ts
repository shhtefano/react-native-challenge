import { spawn } from "child_process";

const prompt =
  "Genera 5 nickname originali per un'app per studenti universitari";

const ollama = spawn("ollama", ["run", "llama3"], {
  stdio: ["pipe", "pipe", "inherit"],
});

ollama.stdin.write(prompt);
ollama.stdin.end();

ollama.stdout.on("data", (data) => {
  console.log("Output:", data.toString());
});