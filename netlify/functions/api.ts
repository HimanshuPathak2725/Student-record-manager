import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const functionPrefix = "/.netlify/functions/api";
  if (req.url.startsWith(functionPrefix)) {
    req.url = req.url.slice(functionPrefix.length) || "/";
  }
  next();
});

let appPromise: Promise<typeof app> | undefined;
let functionHandler: ReturnType<typeof serverless> | undefined;

async function getApp() {
  if (!appPromise) {
    appPromise = registerRoutes(app).then(() => app);
  }

  return appPromise;
}

type FunctionHandler = ReturnType<typeof serverless>;
type FunctionEvent = Parameters<FunctionHandler>[0];
type FunctionContext = Parameters<FunctionHandler>[1];

function normalizeEventPath(event: FunctionEvent): FunctionEvent {
  const prefix = "/.netlify/functions/api";
  const normalize = (value: string | undefined) =>
    value?.startsWith(prefix)
      ? `/api${value.slice(prefix.length) || "/"}`
      : value;

  return {
    ...event,
    path: normalize(event.path),
    rawPath: normalize(event.rawPath),
  };
}

export const handler = async (event: FunctionEvent, context: FunctionContext) => {
  try {
    if (!functionHandler) {
      functionHandler = serverless(await getApp());
    }

    return await functionHandler(normalizeEventPath(event), context);
  } catch (error) {
    console.error("Netlify function initialization failed:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to initialize API" }),
    };
  }
};
