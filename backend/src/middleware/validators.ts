import { body, validationResult } from 'express-validator';
import { RequestHandler } from 'express';

export const handleValidation: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);//ValidationResult access a special storage created by body(value) fun
  // you are watching in the validateRegister function which create this speacial storage and stores the 
  //error results it found during validation.
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

export const validateRegister = [
  body('name').isString().trim().isLength({ min: 2, max: 50 }),
  body('email').isString().trim().isEmail().normalizeEmail(),
  body('dateOfBirth').isISO8601().toDate()
];

export const validateSendOtp = [
  body('email').isString().trim().isEmail().normalizeEmail()
];

export const validateVerifyOtp = [
  body('email').isString().trim().isEmail().normalizeEmail(),
  body('otp').isString().trim().isLength({ min: 6, max: 6 })
];

export const validateLogin = [
  body('email').isString().trim().isEmail().normalizeEmail()
];

export const validateNoteInput: RequestHandler = (req, res, next) => {
  const { title, content } = req.body;

  // Check if title is provided and not empty
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ 
      message: 'Title is required and cannot be empty',
      field: 'title'
    });
  }

  // Check if title is not too long (optional validation)
  if (title.trim().length > 100) {
    return res.status(400).json({ 
      message: 'Title cannot exceed 100 characters',
      field: 'title'
    });
  }

  // Check if content is a string if provided
  if (content !== undefined && typeof content !== 'string') {
    return res.status(400).json({ 
      message: 'Content must be a string',
      field: 'content'
    });
  }

  // Check if content is not too long (optional validation)
  if (content && content.length > 10000) {
    return res.status(400).json({ 
      message: 'Content cannot exceed 10000 characters',
      field: 'content'
    });
  }

  // Sanitize the input
  req.body.title = title.trim();
  req.body.content = content ? content.trim() : '';

  next();
};

export const validateNoteId: RequestHandler = (req, res, next) => {
  const { id } = req.params;
  
  // Check if id exists and is a valid MongoDB ObjectId
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ 
      message: 'Note ID is required',
      field: 'id'
    });
  }
  
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(id)) {
    return res.status(400).json({ 
      message: 'Invalid note ID format',
      field: 'id'
    });
  }

  next();
};
