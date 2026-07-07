import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import config from "./config";
import { adminRouter } from "./modules/admin/admin.route";
import { authRouter } from "./modules/auth/auth.route";
import { categoryRouter } from "./modules/category/category.route";
import { gearRouter } from "./modules/gear/gear.route";
import { stripeWebhook } from "./modules/payment/payment.controller";
import { paymentRouter } from "./modules/payment/payment.route";
import { providerRouter } from "./modules/provider/provider.route";
import { rentalRouter } from "./modules/rental/rental.route";
import { reviewRouter } from "./modules/review/review.route";

const app: Application = express();

app.use(
  cors({
    origin: config.APP_URL,
    credentials: true,
  }),
);

// stripe webhook needs raw body, must stay before express.json()
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
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
app.use("/api/categories", categoryRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/provider", providerRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);

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
