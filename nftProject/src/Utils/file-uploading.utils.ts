import * as Crypto from 'crypto';
import { HttpException, HttpStatus } from '@nestjs/common';

export const imageFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new HttpException(
        'Only png, jpeg & jpg files are allowed.',
        HttpStatus.FORBIDDEN,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const extension = file.originalname.split('.').pop();
  console.log('Extension of the file : ', extension);
  const newNameFile = Crypto.randomBytes(20).toString('hex') + '.' + extension;
  callback(null, newNameFile);
};
