import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token not found.' });

  jwt.verify(token, process.env.SECRET as string, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = decoded as { _id: string; username: string; isAdmin: boolean };
    next();
  });
};
export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token not found.' });
  jwt.verify(token, process.env.SECRET as string, (err, decoded) => {
    if (err || !(decoded as { isAdmin: boolean }).isAdmin)
      return res.status(403).json({ message: 'Access denied.' });
    req.user = decoded as { _id: string; username: string; isAdmin: boolean };
    next();
  });
};
