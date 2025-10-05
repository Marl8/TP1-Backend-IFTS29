import express from 'express';
const router = express.Router();
import MenuItemController from '../controllers/MenuItemController.js';

router.get('/findMenuItems', MenuItemController.findMenuItemsAPI);
router.get('/findMenuItem/:id', MenuItemController.findMenuItemByIdAPI);
router.post('/saveMenuItem/', MenuItemController.saveMenuItemAPI);
router.put('/updateMenuItem/:id', MenuItemController.updateMenuItemAPI);
router.patch('/updateStockItem/:id', MenuItemController.updateStockItemAPI);
router.delete('/deleteMenuItem/:id', MenuItemController.deleteMenuItemAPI);

export default router;