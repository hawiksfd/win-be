import express from "express";
import { verifyToken } from "./../utils/verifyToken.js";
import {
  createProduct,
  updateProduct,
  getProductById,
  getProduct,
  deleteProduct,
} from "./../controllers/productContr.js";

const router = express.Router();

router.post("/product/create", verifyToken, createProduct);
router.put("/product/edit/:id", verifyToken, updateProduct);
router.get("/product/:id", verifyToken, getProductById);
router.get("/product/", verifyToken, getProduct);
router.delete("/product/delete/:id", verifyToken, deleteProduct);

export default router;
