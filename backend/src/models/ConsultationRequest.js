const mongoose = require('mongoose');

const consultationRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    primaryGoal: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    source: {
      type: String,
      default: 'contact-page',
      trim: true,
    },
    selectedPlanId: {
      type: String,
      default: '',
      trim: true,
    },
    selectedPlanName: {
      type: String,
      default: '',
      trim: true,
    },
    selectedPlanPrice: {
      type: String,
      default: '',
      trim: true,
    },
    selectedPlanSavings: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('ConsultationRequest', consultationRequestSchema);
