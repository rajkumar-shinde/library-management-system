import "dotenv/config";
import dns from "node:dns";
import app from "./app.js";
import connectDB from "./db/index.db.js";

dns.setServers(["8.8.8.8"]);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
