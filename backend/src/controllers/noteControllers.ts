import { RequestHandler } from 'express';
import Note from '../models/Note';

// Extend the Request interface to include user property
type AuthenticatedRequest = { user: { id: string } } & Parameters<RequestHandler>[0];

export const createNote: RequestHandler = async (req, res) => {
  try {
    if (!(req as any).user) return res.status(401).json({ message: 'Unauthorized' });
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      userId: (req as any).user.id
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Note creation failed', error: err });
  }
};

export const getNotes: RequestHandler = async (req, res) => {
  try {
    if (!(req as any).user) return res.status(401).json({ message: 'Unauthorized' });
    const notes = await Note.find({ userId: (req as any).user.id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Fetching notes failed', error: err });
  }
};

export const updateNote: RequestHandler = async (req, res) => {
  try {
    if (!(req as any).user) return res.status(401).json({ message: 'Unauthorized' });
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: (req as any).user.id },
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Note update failed', error: err });
  }
};

export const deleteNote: RequestHandler = async (req, res) => {
  try {
    if (!(req as any).user) return res.status(401).json({ message: 'Unauthorized' });
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: (req as any).user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Note deletion failed', error: err });
  }
};
