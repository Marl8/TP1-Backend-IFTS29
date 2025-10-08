import express from 'express';
const router = express.Router();
import MenuItemAPIController from '../controllers/MenuItemAPIController.js';

router.get('/findMenuItems', MenuItemAPIController.findMenuItemsAPI);
router.get('/findMenuItem/:id', MenuItemAPIController.findMenuItemByIdAPI);
router.post('/saveMenuItem/', MenuItemAPIController.saveMenuItemAPI);
router.put('/updateMenuItem/:id', MenuItemAPIController.updateMenuItemAPI);
router.patch('/updateStockItem/:id', MenuItemAPIController.updateStockItemAPI);
router.delete('/deleteMenuItem/:id', MenuItemAPIController.deleteMenuItemAPI);

export default router;