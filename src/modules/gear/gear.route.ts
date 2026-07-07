import { Router } from "express";
import { getAllGear, getGearById } from "./gear.controller";

const router = Router();

router.get("/", getAllGear);
router.get("/:id", getGearById);

export const gearRouter = router;
