import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
  res.json(await manager.createCart());
});

router.get("/:cid", async (req, res) => {
  res.json(await manager.getCartById(req.params.cid));
});

router.post("/:cid/product/:pid", async (req, res) => {
  res.json(
    await manager.addProductToCart(req.params.cid, req.params.pid)
  );
});

export default router;