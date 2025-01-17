import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

// /**
//  * @swagger
//  * /api/v1/api-docs:
//  *   get:
//  *     summary: Redirect to API documentation
//  *     tags: [Docs]
//  *     responses:
//  *       302:
//  *         description: Redirect to Swagger UI
//  */
// router.get("/api-docs", (req, res) => {
//   res.redirect("/api-docs");
// });

export default router;
