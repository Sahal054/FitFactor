class MongoAuditTransport {
  constructor({ model }) {
    if (!model || typeof model.create !== 'function') {
      throw new TypeError('MongoAuditTransport requires a Mongoose-like model with create/find methods');
    }

    this.model = model;
  }

  async append(event) {
    await this.model.create({
      ...event,
      createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
      expiresAt: event.retention?.retainUntil ? new Date(event.retention.retainUntil) : null,
    });

    return event;
  }

  async getLastIntegrity() {
    const latest = await this.model
      .findOne({}, { 'integrity.hash': 1 })
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    return latest?.integrity?.hash || null;
  }

  async query(filters = {}) {
    const query = {};

    if (filters.classification) {
      query.classification = filters.classification;
    }

    if (filters.eventType) {
      query.eventType = filters.eventType;
    }

    if (filters.actorId) {
      query['actor.id'] = filters.actorId;
    }

    if (filters.subjectId) {
      query['subject.id'] = filters.subjectId;
    }

    if (filters.from || filters.to) {
      query.createdAt = {};

      if (filters.from) {
        query.createdAt.$gte = new Date(filters.from);
      }

      if (filters.to) {
        query.createdAt.$lte = new Date(filters.to);
      }
    }

    const request = this.model
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    if (filters.limit) {
      request.limit(filters.limit);
    }

    return request;
  }

  async purgeExpired(referenceDate = new Date()) {
    const result = await this.model.deleteMany({
      'retention.legalHold': { $ne: true },
      expiresAt: { $ne: null, $lte: new Date(referenceDate) },
    });

    return { deletedCount: result?.deletedCount || 0 };
  }
}

module.exports = {
  MongoAuditTransport,
};
