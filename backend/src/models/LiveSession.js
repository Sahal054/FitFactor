const mongoose = require('mongoose');

const muxSchema = new mongoose.Schema(
  {
    uploadId: {
      type: String,
      default: '',
      trim: true,
    },
    uploadStatus: {
      type: String,
      default: 'waiting',
      trim: true,
    },
    assetId: {
      type: String,
      default: '',
      trim: true,
    },
    assetStatus: {
      type: String,
      default: 'waiting',
      trim: true,
    },
    playbackId: {
      type: String,
      default: '',
      trim: true,
    },
    playbackPolicy: {
      type: String,
      default: 'public',
      trim: true,
    },
    sourceFileName: {
      type: String,
      default: '',
      trim: true,
    },
    passthrough: {
      type: String,
      default: '',
      trim: true,
    },
    errorMessage: {
      type: String,
      default: '',
      trim: true,
    },
    lastSyncedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const liveSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    coachName: {
      type: String,
      required: true,
      trim: true,
    },
    startAt: {
      type: Date,
      required: true,
      index: true,
    },
    endAt: {
      type: Date,
      index: true,
      default: null,
    },
    videoDurationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    accessNote: {
      type: String,
      default: '',
      trim: true,
    },
    mux: {
      type: muxSchema,
      default: () => ({}),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

liveSessionSchema.index({ startAt: 1, endAt: 1 });

module.exports = mongoose.model('LiveSession', liveSessionSchema);
