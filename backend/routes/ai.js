import { Router } from "express";
import { aiAssistantService } from "../services/aiAssistantService.js";

const router = Router();

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt string is required in request body" });
    }

    const result = await aiAssistantService.processChat(prompt.trim());
    res.json(result);
  } catch (err) {
    console.error("AI chat handler error:", err);
    res.status(500).json({ error: "Failed to process AI movie request", message: err.message });
  }
});

export default router;
