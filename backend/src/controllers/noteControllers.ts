import { RequestHandler } from 'express';
import Note from '../models/Note';

// Extend the Request interface to include user property
type AuthenticatedRequest = { user: { id: string } } & Parameters<RequestHandler>[0];

export const createNote: RequestHandler = async (req, res) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, content } = req.body;
    
    const note = await Note.create({
      title,
      content: content || '',
      userId: (req as any).user.id
    });

    res.status(201).json({
      success: true,
      data: note,
      message: 'Note created successfully'
    });
  } catch (err) {
    console.error('Note creation error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Note creation failed', 
      error: process.env.NODE_ENV === 'development' ? err : 'Internal server error'
    });
  }
};

export const getNotes: RequestHandler = async (req, res) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50'
      });
    }

    const userId = (req as any).user.id;

    // Get notes with pagination
    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    // Get total count for pagination info
    const totalNotes = await Note.countDocuments({ userId });
    const totalPages = Math.ceil(totalNotes / limit);

    res.status(200).json({
      success: true,
      data: {
        notes: notes,
        pagination: {
          page: page,
          limit: limit,
          totalNotes: totalNotes,
          totalPages: totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      },
      message: 'Notes fetched successfully'
    });
  } catch (err) {
    console.error('Fetch notes error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Fetching notes failed', 
      error: process.env.NODE_ENV === 'development' ? err : 'Internal server error'
    });
  }
};

export const updateNote: RequestHandler = async (req, res) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { title, content } = req.body;
    const userId = (req as any).user.id;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { 
        title,
        content: content !== undefined ? content : '',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found or you do not have permission to update it' 
      });
    }

    res.status(200).json({
      success: true,
      data: note,
      message: 'Note updated successfully'
    });
  } catch (err) {
    console.error('Note update error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Note update failed', 
      error: process.env.NODE_ENV === 'development' ? err : 'Internal server error'
    });
  }
};

export const deleteNote: RequestHandler = async (req, res) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const userId = (req as any).user.id;

    const note = await Note.findOneAndDelete({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found or you do not have permission to delete it' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Note deleted successfully',
      data: { id: note._id }
    });
  } catch (err) {
    console.error('Note deletion error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Note deletion failed', 
      error: process.env.NODE_ENV === 'development' ? err : 'Internal server error'
    });
  }
};
