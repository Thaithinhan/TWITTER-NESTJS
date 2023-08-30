import { Request } from 'express';
import * as multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import cloudinary from './cloudinary.config';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let imageFormat = file.originalname.split('.').pop();
    return {
      folder: 'user-uploads',
      format: imageFormat,
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed!'),
      false,
    );
  }
};

const uploadLimits = {
  fileSize: 2 * 1024 * 1024,
};

export const multerUpload = {
  storage: storage,
  fileFilter: fileFilter,
  limits: uploadLimits,
};
