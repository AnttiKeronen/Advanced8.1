import 'express';
declare module 'express' {
  interface Request {
    user?: {
      _id: string;
      username: string;
      isAdmin: boolean;
    };
  }
}

