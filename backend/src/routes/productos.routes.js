/**
 * @file productos.routes.js
 * @description Definición de rutas REST para la gestión de productos en ELECTRONOVA.
 * @module routes/productos
 */

import { Router } from "express";
import {
  getProductos,
  searchProductos,
  filterProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productos.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const productosRoutes = Router();

// ==========================================
// Rutas Públicas (Invitados y Clientes)
// ==========================================
productosRoutes.get("/", getProductos);
productosRoutes.get("/buscar", searchProductos);
productosRoutes.get("/filtrar", filterProductos);
productosRoutes.get("/:id", getProductoById);

// ==========================================
// Rutas Privadas (Exclusivas Administrador)
// ==========================================
productosRoutes.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.array("imagenes", 5),
  createProducto
);

productosRoutes.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.array("imagenes", 5),
  updateProducto
);

productosRoutes.delete("/:id", authMiddleware, adminMiddleware, deleteProducto);

export { productosRoutes };

