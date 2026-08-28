import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/health", (req: Request, res: Response) => {
  res.json({message: 'hello'}).status(200)
});

export { app }

export default app