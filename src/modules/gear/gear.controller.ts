import { Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";
import { ISearchTerm } from "./gear.interface";
import { getGearByIdDb, getGearDb } from "./gear.service";

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const query: ISearchTerm = req.query;
  const result = await getGearDb(query);

  sendResponse(res, "Gear fetched successfully", result);
});

const getGearById = catchAsync(async (req: Request, res: Response) => {
  const result = await getGearByIdDb(req.params.id as string);

  sendResponse(res, "Gear details fetched successfully", result);
});

export { getAllGear, getGearById };
