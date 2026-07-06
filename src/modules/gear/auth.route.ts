import { Router } from "express";
import { getAllGear } from "./auth.controller";

const router = Router();

router.get("/", getAllGear);
// router.get("/:id");
// router.get("/categories");

export const gearRouter = router;
