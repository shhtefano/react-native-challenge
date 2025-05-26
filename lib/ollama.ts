export async function generateNicknames(prompt: string): Promise<string[]> {
  const res = await fetch("http://localhost:3001/nickname", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  console.log("Response status:", res.status);
  
  const data = await res.json();
  return data.response.split("\n").filter((line:String) => line.trim() !== "");
}