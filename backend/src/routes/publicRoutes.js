const express = require('express');
const ConsultationRequest = require('../models/ConsultationRequest');
const siteContent = require('../data/siteContent');
const asyncHandler = require('../utils/asyncHandler');
const { findSessionForPublic } = require('../services/liveSessionService');
const { createHttpError } = require('../utils/liveSession');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
  });
});

router.get('/app-shell', (req, res) => {
  res.json(siteContent.appShell);
});

router.get('/pages/home', (req, res) => {
  res.json(siteContent.homePage);
});

router.get('/pages/about', (req, res) => {
  res.json(siteContent.aboutPage);
});

router.get('/pages/pricing', (req, res) => {
  res.json(siteContent.pricingPage);
});

router.get('/pages/contact', (req, res) => {
  res.json(siteContent.contactPage);
});

router.get(
  '/pages/daily-live-session',
  asyncHandler(async (req, res) => {
    const session = await findSessionForPublic();

    res.json({
      ...siteContent.dailyLiveSessionPage,
      session,
    });
  }),
);

router.post(
  '/consultation-requests',
  asyncHandler(async (req, res) => {
    const {
      fullName,
      phoneNumber,
      primaryGoal,
      message = '',
      source = 'contact-page',
      selectedPlanId = '',
      selectedPlanName = '',
      selectedPlanPrice = '',
      selectedPlanSavings = '',
    } = req.body || {};

    if (!fullName?.trim() || !phoneNumber?.trim() || !primaryGoal?.trim()) {
      throw createHttpError(400, 'Full name, phone number, and primary goal are required.');
    }

    const consultationRequest = await ConsultationRequest.create({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      primaryGoal: primaryGoal.trim(),
      message: message.trim(),
      source: source.trim(),
      selectedPlanId: selectedPlanId.trim(),
      selectedPlanName: selectedPlanName.trim(),
      selectedPlanPrice: selectedPlanPrice.trim(),
      selectedPlanSavings: selectedPlanSavings.trim(),
    });

    res.status(201).json({
      success: true,
      requestId: String(consultationRequest._id),
      message: 'Consultation request submitted successfully.',
    });
  }),
);

module.exports = router;
