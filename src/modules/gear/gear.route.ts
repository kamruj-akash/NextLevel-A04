import { Router } from "express";
import { getAllGear } from "./gear.controller";

const router = Router();

router.get("/", getAllGear);
// router.get("/:id");
// router.get("/categories");

export const gearRouter = router;
