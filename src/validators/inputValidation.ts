import { body } from 'express-validator';
export const registerValidation = [
  body('username').trim().isLength({ min: 3, max: 25 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').trim()
];
