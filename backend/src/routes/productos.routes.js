import { Router } from "express";
import {
  getProductos,
  searchProductos,
  filterProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} from "../controllers/productos.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const productosRoutes = Router();

productosRoutes.get("/", getProductos);
productosRoutes.get("/buscar", searchProductos);
productosRoutes.get("/filtrar", filterProductos);
productosRoutes.get("/:id", getProductoById);
productosRoutes.post("/", authMiddleware, createProducto);
productosRoutes.put("/:id", authMiddleware, updateProducto);
productosRoutes.delete("/:id", authMiddleware, deleteProducto);

export { productosRoutes };
