import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import { gearRouter } from "./modules/gear/gear.route";
import { providerRouter } from "./modules/provider/provider.route";

// import bcrypt from "bcryptjs";

const app: Application = express();

app.use(
  cors({
    origin: config.APP_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// root route
app.get("/", async (req: Request, res: Response) => {
  try {
    // const users = await prisma.user.findMany();
    res.status(200).json({ success: true, message: "success!!" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message });
  }
});

// all routes
app.use("/api/auth", authRouter);
app.use("/api/gear", gearRouter);
app.use("/api/provider", providerRouter);

// not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `${req.originalUrl} Route not found, at ${new Date()}`,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Unknown error";
  res.status(500).json({
    success: false,
    message,
    stack: err.stack || "No stack trace available",
  });
});

export default app;
