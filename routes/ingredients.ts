import { Router, Request, Response, NextFunction } from 'express';
import { createIngredientTable, createIngredient, deleteIngredient, getAllIngredients, getIngredientById, updateIngredient, getIngredientByTitle } from '../models/ingredient';

export const ingredientsRouter = Router();

// Access code validation middleware
const validateAccessCode = (req: Request, res: Response, next: NextFunction) => {
  const accessCode = req.query.acode;
  
  if (!accessCode || accessCode !== process.env.USER_ACCESS_KEY) {
    return res.status(401).json({ error: 'Invalid or missing access code' });
  }
  
  next();
};

// Apply middleware to all routes
ingredientsRouter.use(validateAccessCode);

//init item table
createIngredientTable().catch(console.error)

// Create a new item
ingredientsRouter.post('/', async (req, res) => {
    try {
      const ingredient = await createIngredient(req.body);
      res.status(201).json(ingredient);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all users
  ingredientsRouter.get('/', async (req, res) => {
    try {
      const ingredients = await getAllIngredients();
      res.json(ingredients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get user by ID
  ingredientsRouter.get('/:id', async (req, res) => {
    try {
      const ingredient = await getIngredientById(req.params.id);
      if (!ingredient) {
        return res.status(404).json({ message: 'Ingredient not found' });
      }
      res.json(ingredient);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user by title
  ingredientsRouter.get('/title/:title', async (req, res) => {
    try {
      const ingredient = await getIngredientByTitle(req.params.title);
      res.json(ingredient);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user
  ingredientsRouter.put('/:id', async (req, res) => {
    try {
      const ingredient = await updateIngredient(req.params.id, req.body);
      if (!ingredient) {
        return res.status(404).json({ message: 'Ingredient not found' });
      }
      res.json(ingredient);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete user
  ingredientsRouter.delete('/:id', async (req, res) => {
    try {
      const ingredient = await deleteIngredient(req.params.id);
      if (!ingredient) {
        return res.status(404).json({ message: 'Ingredient not found' });
      }
      res.json({ message: 'Ingredient deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });


