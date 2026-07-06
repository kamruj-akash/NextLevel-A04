import { Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";
import { getGearDb } from "./auth.service";
import { ISearchTerm } from "./gear.interface";

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const { category, price, brand }: ISearchTerm = req.query;
  const result = await getGearDb(category, price, brand);

  sendResponse(res, "Gear fetched successfully", result);
});

export { getAllGear };
