import express, { Request, Response } from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let isInitialized = false;

export default async function handler(req: Request, res: Response) {
  if (!isInitialized) {
    await registerRoutes(app);
    isInitialized = true;
  }
  return app(req, res);
}
