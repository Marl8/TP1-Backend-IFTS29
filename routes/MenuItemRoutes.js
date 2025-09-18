const express = require('express');
const router = express.Router();
const MenuItemController = require('../controllers/MenuItemController.js');

router.get('/findMenuItems', MenuItemController.findMenuItems);
router.get('/findMenuItem/:id', MenuItemController.findMenuItemById);
router.post('/saveMenuItem/', MenuItemController.saveMenuItem);
router.put('/updateMenuItem/:id', MenuItemController.updateMenuItem);
router.patch('/updateStockItem/:id', MenuItemController.updateStockItem);
router.delete('/deleteMenuItem/:id', MenuItemController.deleteMenuItem);

module.exports = router;