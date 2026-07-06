import { Response } from "express";

export const sendResponse = (
  res: Response,
  data?: any,
  statusCode = 200,
  message?: string,
) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};
