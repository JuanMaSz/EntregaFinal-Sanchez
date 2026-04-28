import { Router } from "express";
import Product from "../models/Product.js";

export default (io) => {
  const router = Router();

  
  router.get("/", async (req, res) => {
    try {
      let { limit = 10, page = 1, sort, query } = req.query;

      const filter = {};
      if (query) filter.category = query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true
      };

      if (sort) {
        options.sort = { price: sort === "asc" ? 1 : -1 };
      }

      const result = await Product.paginate(filter, options);
      res.json(result);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
  router.get("/:pid", async (req, res) => {
    try {
      const product = await Product.findById(req.params.pid);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
  router.post("/", async (req, res) => {
    try {
      const newProduct = await Product.create(req.body);

      const products = await Product.find().lean();
      io.emit("updateProducts", products);

      res.json(newProduct);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
  router.put("/:pid", async (req, res) => {
    try {
      const updated = await Product.findByIdAndUpdate(
        req.params.pid,
        req.body,
        { new: true }
      );

      res.json(updated);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  router.delete("/:pid", async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.pid);

      const products = await Product.find().lean();
      io.emit("updateProducts", products);

      res.send("Eliminado");

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};