const {findData, writeData} = require('../data/db.js');
const MenuItem = require('../models/MenuItem.js')


// Buscar MeniItems

exports.findMenuItems = async(req, res) => {
    const db = await findData();
    if(db.MenuItem.length !== 0){
        res.status(200).json(db.MenuItem);
    }else{
        res.status(400).json({message: 'No existen item'});
    }
}


// Buscar MeniItem por id

exports.findMenuItemById = async(req, res) => {
    const db = await findData();
    const id = parseInt(req.params.id);
    const item = db.MenuItem.find(i => i.id === id);

    if(!item){
        res.status(400).json({message: 'Item no encontrado'});
    }
    res.status(200).json(item);
}


// Guardar un MeniItem

exports.saveMenuItem = async(req, res)=>{
    const db = await findData();
    const {id, name, price, category, stock, listSupplies} = req.body;

    if (!id || !name || !price || !category || !stock || !listSupplies || !Array.isArray(listSupplies)) {
            return res.status(400).json({ 
                message: 'Datos incompletos. Se requieren: id, name, price, category, stock, listSupplies' 
        });
    }
    const found = db.MenuItem.filter(i => i.id === id);

    if(found.length !== 0){
        return res.status(400).json({ message: 'Ya existe un item con este id' });
    }

    const {invalidSupplies, validSupplies} = suppliesValidator(listSupplies, db);
    if (invalidSupplies.length > 0) {
        return res.status(400).json({ error: 'Algunos suministros no existen en la base de datos.', invalidSupplies });
    }

    const item = new MenuItem(id, name, price, category, stock);
    item.setSupplies(validSupplies);
    const itemDto = {
        id: item.getId(),
        name: item.getName(),
        price: item.getPrice(),
        category: item.getCategory(),
        stock: item.getStock(),
        listSupplies: item.getSupplies()
    }
    db.MenuItem.push(itemDto);
    writeData(db);
    res.status(201).json({message: 'Item guardado con éxito'});
};

function suppliesValidator(supplies, db){
    const validSupplies = [];
    const invalidSupplies = [];

    supplies.forEach(supplyId => {
        const supply = db.supply.find(supply => supply.id === supplyId);
        if (supply) {
            validSupplies.push({
                id: supply.id,
                name: supply.name,
                category: supply.category,
                unitPrice: supply.unitPrice,
                stock: supply.stock
            });
        } else {
            invalidSupplies.push(supplyId);
        }
    });
    return {invalidSupplies, validSupplies}
}


// Actualizar MeniItem

exports.updateMenuItem = async (req, res)=>{
    const db = await findData();
    const id = parseInt(req.params.id);

    const {name, price, category, stock, listSupplies} = req.body;
    if (!id || !name || !price || !category || !stock || !listSupplies || !Array.isArray(listSupplies)) {
            return res.status(400).json({ 
                message: 'Datos incompletos. Se requieren: id, name, price, category, stock, listSupplies' 
        });
    }
    const index = db.MenuItem.findIndex(c => c.id === id);

    if(index === -1){
        return res.status(400).send('Item no encontrado');
    }  

    const {invalidSupplies, validSupplies} = suppliesValidator(listSupplies, db);
    if (invalidSupplies.length > 0) {
        return res.status(400).json({ error: 'Algunos suministros no existen en la base de datos.', invalidSupplies });
    }

    db.MenuItem[index] = { 
        id, 
        name: name,
        price: price,
        category: category,
        stock: stock, 
        listSupplies: validSupplies
        };          
    writeData(db);
    res.json({menuItem: db.MenuItem[index], message: 'Item modificado con éxito'});
};


// Actualizar stock del MeniItem

exports.updateStockItem = async (req, res)=>{
    const db = await findData();
    const id = parseInt(req.params.id);

    const item = db.MenuItem.find(item => item.id === id);

    if(!item){
        return res.status(400).send('Supply no encontrado');
    }  

    Object.assign(item, req.body);          
    writeData(db);
    res.json({item: item, message: 'Item modificado con éxito'});
};


// Eliminar un MeniItem

exports.deleteMenuItem = async (req, res)=>{
    const db = await findData();
    const id = parseInt(req.params.id);
    const i = db.MenuItem.length; 
    db.MenuItem = db.MenuItem.filter(u => u.id !== id);

    if (db.MenuItem.length === i){
        return res.status(400).send('Item no encontrado');
    } 
    writeData(db);
    res.status(200).json({message: 'Item Borrado con éxito'}); 
};
