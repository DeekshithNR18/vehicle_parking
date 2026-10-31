import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import slotRoutes from "./routes/slots.js";
import bookingRoutes from "./routes/bookings.js";
import walletRoutes from "./routes/wallet.js";
import complaintRoutes from "./routes/complaints.js";
import sosRoutes from "./routes/sos.js";
import visitorRoutes from "./routes/visitors.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "veh_parking1 API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/visitors", visitorRoutes);

const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("?? Client connected:", socket.id);
  socket.on("disconnect", () => console.log("?? Client disconnected:", socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`?? Backend running: http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
