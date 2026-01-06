import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded as {
      _id: string;
      username: string;
      isAdmin: boolean;
    };

    next();
  });
};

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  authenticateUser(req, res, () => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin only' });
    }
    next();
  });
};
