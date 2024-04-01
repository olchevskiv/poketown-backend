import express from "express";
import WebhookController from "../controllers/WebhookController";

const router = express.Router();

router.post("/stripe",WebhookController.stripeWebhookHandler);

export default router;