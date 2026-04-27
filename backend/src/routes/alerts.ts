import { Router } from "express";
import { Alert } from "../models/Alert";

export const alertsRouter = Router();

// POST /api/alerts - Subscribe
alertsRouter.post("/", async (req, res) => {
  try {
    const { email, roles, locations, keywords, minStipend } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const alert = await Alert.findOneAndUpdate(
      { email },
      { roles, locations, keywords, minStipend, isActive: true },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Subscription updated", alert });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/alerts/unsubscribe - Unsubscribe
alertsRouter.delete("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;
    await Alert.findOneAndUpdate({ email }, { isActive: false });
    res.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
