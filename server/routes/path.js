import Router from "express";
import verify from "./verifyToken.js";

const router = Router();

router.get("/posts", verify, (req, res) => {
  res.json({ posts: { title: "first post", description: "random data" } });
});

export default router;
