import MenuItemService from'../services/MenuItemService.js';


// Buscar MenuItems

const findMenuItemsAPI = async(req, res) => {
    try {
        const menuItems = await MenuItemService.findMenuItems();
        if(menuItems.length !== 0){
            res.status(200).json(menuItems);
        }else{
            res.status(400).json({message: 'No existen item'});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }    
}


// Buscar MenuItem por id

const findMenuItemByIdAPI = async(req, res) => {
    try {
        const id = req.params.id;
        const item = await MenuItemService.findMenuItemById(id);
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    
}


// Guardar un MenuItem

const saveMenuItemAPI = async(req, res)=>{
    try {
        const saveMenuItem = await MenuItemService.saveMenuItem(req.body);
        res.status(201).json({message: 'Item guardado con éxito', saveMenuItem});
    } catch (error) {
        res.status(400).json({message: error.message});
    }    
};


// Actualizar MenuItem

const updateMenuItemAPI = async (req, res)=>{
    try {
        const id = req.params.id;
    const result= await MenuItemService.updateMenuItem(id, req.body);
    if (result.error) {
            return res.status(400).json({ message: result.error });
        }
        res.status(200).json({ menuItem: result.menuItem, message: result.message });
    } catch (error) {
        res.status(400).json({message: error.message});
    }        
};


// Actualizar stock del MenuItem

const updateStockItemAPI = async (req, res) => {
    try {
        const id = req.params.id;
        const {stock} = req.body;
        const result = await MenuItemService.updateStockItem(id, stock);
        res.status(200).json({ menuItem: result.menuItem, message: result.message });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    
};

// Eliminar un MenuItem

const deleteMenuItemAPI = async (req, res)=>{
    try {
        const id = req.params.id;
    const result = await MenuItemService.deleteMenuItem(id);

    if (!result){
        return res.status(400).json({error: 'MenuItem no encontrado'});
    }
    res.status(200).json( {message: 'Borrado con éxito'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


const MenuItemController = {
    findMenuItemsAPI,
    findMenuItemByIdAPI,
    saveMenuItemAPI,
    updateMenuItemAPI,
    updateStockItemAPI,
    deleteMenuItemAPI,
}

export default MenuItemController;