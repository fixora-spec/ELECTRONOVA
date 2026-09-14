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
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const productosRoutes = Router();

productosRoutes.get("/", getProductos);
productosRoutes.get("/buscar", searchProductos);
productosRoutes.get("/filtrar", filterProductos);
productosRoutes.get("/:id", getProductoById);
productosRoutes.post("/", authMiddleware, uploadMiddleware.array("imagenes", 5), createProducto);
productosRoutes.put("/:id", authMiddleware, uploadMiddleware.array("imagenes", 5), updateProducto);
productosRoutes.delete("/:id", authMiddleware, deleteProducto);

export { productosRoutes };
