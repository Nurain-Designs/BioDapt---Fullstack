console.log("Booting index.ts...");
import { app } from "./app";

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`⚡️ Backend listening at http://localhost:${PORT}`);
});

// Force event loop to stay alive in case ts-node on Windows drains it
setInterval(() => {}, 1000 * 60 * 60);
