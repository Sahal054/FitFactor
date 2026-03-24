const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { verifyMuxWebhookSignature } = require('../services/muxService');
const { handleMuxWebhookEvent } = require('../services/liveSessionService');

const router = express.Router();

router.post(
  '/webhooks',
  asyncHandler(async (req, res) => {
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : '';

    verifyMuxWebhookSignature(req.get('mux-signature') || '', rawBody);

    const event = rawBody ? JSON.parse(rawBody) : {};
    await handleMuxWebhookEvent(event);

    res.status(204).send();
  }),
);

module.exports = router;
