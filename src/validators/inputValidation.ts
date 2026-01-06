import { body } from 'express-validator';

export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage('Username must be 3-25 characters long')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/[0-9]/)
    .matches(/[#!&?]/)
    .withMessage('Password must be strong')
];

export const loginValidation = [
  body('email').trim().isEmail().normalizeEmail(),
  body('password').trim()
];
