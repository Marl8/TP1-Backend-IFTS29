import express from 'express';
const router = express.Router();
import MenuItemController from '../controllers/MenuItemController.js';

router.get('/findMenuItems', MenuItemController.findMenuItems);
router.get('/findMenuItem/:id', MenuItemController.findMenuItemById);
router.post('/saveMenuItem/', MenuItemController.saveMenuItem);
router.put('/updateMenuItem/:id', MenuItemController.updateMenuItem);
router.patch('/updateStockItem/:id', MenuItemController.updateStockItem);
router.delete('/deleteMenuItem/:id', MenuItemController.deleteMenuItem);

export default router;