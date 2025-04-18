import { Router } from 'express';
import { createShopTable, createShop, deleteShop, getAllShops, getShopById, updateShop } from '../models/shop';

export const shopsRouter = Router();

//init item table
createShopTable().catch(console.error)

// Create a new item
shopsRouter.post('/', async (req, res) => {
    try {
      const shop = await createShop(req.body);
      res.status(201).json(shop);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all users
  shopsRouter.get('/', async (req, res) => {
    try {
      const shops = await getAllShops();
      res.json(shops);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get user by ID
  shopsRouter.get('/:id', async (req, res) => {
    try {
      const shop = await getShopById(req.params.id);
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }
      res.json(shop);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user
shopsRouter.put('/:id', async (req, res) => {
    try {
      const shop = await updateShop(req.params.id, req.body);
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }
      res.json(shop);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete user
  shopsRouter.delete('/:id', async (req, res) => {
    try {
      const shop = await deleteShop(req.params.id);
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }
      res.json({ message: 'Shop deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });


