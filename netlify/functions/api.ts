import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes";

let cachedHandler: any = null;

async function bootstrap() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Normalize URL path if routed via Netlify Functions
  app.use((req, res, next) => {
    if (req.url.startsWith("/.netlify/functions/api")) {
      req.url = req.url.replace("/.netlify/functions/api", "/api");
    }
    next();
  });

  await registerRoutes(app);
  return serverless(app);
}

export const handler = async (event: any, context: any) => {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  return cachedHandler(event, context);
};
