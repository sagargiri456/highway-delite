import express from 'express';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote
} from '../controllers/noteControllers';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(verifyToken); // protect all note routes

router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
