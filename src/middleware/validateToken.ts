import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
interface JwtPayload {
  _id: string;
  username: string;
  isAdmin: boolean;
}
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token not found.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  authenticateUser(req, res, () => {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Access denied.' });
    next();
  });
};
