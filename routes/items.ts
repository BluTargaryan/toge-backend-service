import { Router } from 'express';
import { createItemTable, createItem, deleteItem, getAllItems, getItemById, updateItem } from '../models/item';

export const expressRouter = Router();

//init item table
createItemTable().catch(console.error)

// Create a new item
expressRouter.post('/', async (req, res) => {
    try {
      const item = await createItem(req.body);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all users
expressRouter.get('/', async (req, res) => {
    try {
      const items = await getAllItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get user by ID
  expressRouter.get('/:id', async (req, res) => {
    try {
      const item = await getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user
expressRouter.put('/:id', async (req, res) => {
    try {
      const item = await updateItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete user
  expressRouter.delete('/:id', async (req, res) => {
    try {
      const item = await deleteItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json({ message: 'Item deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });


