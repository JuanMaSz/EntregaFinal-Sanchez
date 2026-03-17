import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

export default (io) => {
  const router = Router();
  const manager = new ProductManager("./src/data/products.json");

  router.get("/", async (req, res) => {
    res.json(await manager.getProducts());
  });

  router.get("/:pid", async (req, res) => {
    res.json(await manager.getProductById(req.params.pid));
  });

  router.post("/", async (req, res) => {
    const newProduct = await manager.addProduct(req.body);

    const products = await manager.getProducts();
    io.emit("updateProducts", products);

    res.json(newProduct);
  });

  router.put("/:pid", async (req, res) => {
    res.json(await manager.updateProduct(req.params.pid, req.body));
  });

  router.delete("/:pid", async (req, res) => {
    await manager.deleteProduct(req.params.pid);

    const products = await manager.getProducts();
    io.emit("updateProducts", products);

    res.send("Eliminado");
  });

  return router;
};