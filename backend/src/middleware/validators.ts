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
