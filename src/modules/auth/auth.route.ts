import { Request, Response, Router } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { regUser } from "./auth.controller";

const router = Router();

router.post("/register", regUser);

router.post(
  "/login",
  catchAsync(async (req: Request, res: Response) => {}),
);

router.get(
  "/me",
  catchAsync(async (req: Request, res: Response) => {}),
);

export const authRouter = router;
