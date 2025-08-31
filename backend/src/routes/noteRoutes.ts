import express from 'express';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote
} from '../controllers/noteControllers';
import { verifyToken } from '../middleware/authMiddleware';
import { validateNoteInput, validateNoteId } from '../middleware/validators';

const router = express.Router();

// Protect all note routes
router.use(verifyToken);

// GET /api/notes - Get user's notes with pagination
router.get('/', getNotes);

// POST /api/notes - Create a new note
router.post('/', validateNoteInput, createNote);

// PUT /api/notes/:id - Update a note
router.put('/:id', validateNoteId, validateNoteInput, updateNote);

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', validateNoteId, deleteNote);

export default router;
