import { Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { regUserDb } from "./auth.service";

const regUser = catchAsync(async (req: Request, res: Response) => {
  const result = regUserDb(req.body);
});

export { regUser };
