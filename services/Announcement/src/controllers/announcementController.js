const Announcement     = require('../models/Announcement');
const { logger }       = require('@frontline/config');
const createHttpError  = require('http-errors');

// GET /api/announcements
exports.listAnnouncements = async (_req, res) => {
  const list = await Announcement.find().sort({ createdAt: -1 });
  res.json(list);
};

// POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description)
    throw createHttpError(400, 'title and description are required');

  const attachments = (req.files || []).map(f => `/uploads/${f.filename}`);

  const ann = await Announcement.create({ title, description, attachments });
  logger.info('Announcement created: %s', ann._id);
  res.status(201).json(ann);
};

// PUT /api/announcements/:id
exports.updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, description, removedAttachments = '[]' } = req.body;

  const ann = await Announcement.findById(id);
  if (!ann) throw createHttpError(404, 'Announcement not found');

  const removed = removedAttachments ? JSON.parse(removedAttachments) : [];
  const keep    = ann.attachments.filter(a => !removed.includes(a));
  const newFiles = (req.files || []).map(f => `/uploads/${f.filename}`);

  ann.title        = title;
  ann.description  = description;
  ann.attachments  = keep.concat(newFiles);
  ann.updatedAt    = new Date();

  await ann.save();
  res.json(ann);
};

// DELETE /api/announcements/:id
exports.deleteAnnouncement = async (req, res) => {
  const deleted = await Announcement.findByIdAndDelete(req.params.id);
  if (!deleted) throw createHttpError(404, 'Announcement not found');
  res.json({ message: 'Announcement deleted' });
};