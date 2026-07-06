import { Request, Response, Router } from "express";

const router = Router();

router.post("/register", (req: Request, res: Response) => {});

router.post("/login", (req: Request, res: Response) => {});

router.get("/me", (req: Request, res: Response) => {});

export const authRouter = router;
