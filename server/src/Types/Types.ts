import { Request } from 'express';

//Type mở rộng cho Request Check Login
export interface ExtendedRequest extends Request {
  userId?: string;
  userRole?: string;
}
