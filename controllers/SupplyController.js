import {findData, writeData} from '../data/db.js';
import Supply from '../models/Supply.js';


// Guardar un suministro

const saveSupply = async(req, res)=>{
    const db = await findData();
    const {id, name, category, unitPrice, stock} = req.body;

    if (!id || !name || !unitPrice || !category || !stock) {
            return res.status(400).json({ 
                message: 'Datos incompletos. Se requieren: id, name, unitPrice, category, stock' 
        });
    }
    const found = db.supply.filter(i => i.id === id);

    if(found.length !== 0){
        return res.status(400).json({ message: 'Ya existe un item con este id' });
    }
    const supply = new Supply(id, name, category, unitPrice, stock);
    const supplyDto = {
        id: supply.getId(),
        name: supply.getName(),
        category: supply.getCategory(),
        unitPrice: supply.getUnitPrice(),
        stock: supply.getStock(),
    }
    db.supply.push(supplyDto);
    writeData(db);
    res.status(201).json({message: 'Suministro guardado con éxito'});
};


// Buscar todos los suministros

const findSupplies = async(req, res) => {
    const db = await findData();
    if(db.supply.length !== 0){
        res.status(200).json(db.supply);
    }else{
        res.status(400).json({message: 'No existen suministros'});
    }
}


// Buscar suministro por id

const findSupplyById = async(req, res) => {
    const db = await findData();
    const id = parseInt(req.params.id);
    const supply = db.supply.find(i => i.id === id);

    if(!supply){
        res.status(400).json({message: 'Supply no encontrado'});
    }
    res.status(200).json(supply);
}


// Actualizar suministro

const updateSupply = async (req, res)=>{
    const db = await findData();
    const id = parseInt(req.params.id);

    const {name, category, unitPrice, stock} = req.body;
    if (!name || !unitPrice || !category || !stock) {
            return res.status(400).json({ 
                message: 'Datos incompletos. Se requieren: name, unitPrice, category, stock' 
        });
    }
    const index = db.supply.findIndex(c => c.id === id);

    if(index === -1){
        return res.status(400).send('Supply no encontrado');
    }  

    db.supply[index] = { 
        id, 
        name: name,
        category: category,
        unitPrice: unitPrice,
        stock: stock 
        };          
    writeData(db);
    res.json({supply: db.supply[index], message: 'Supply modificado con éxito'});
};


// Actualizar el stock del suministro

const updateStockSupply = async (req, res)=>{
    const db = await findData();
    const id = parseInt(req.params.id);

    const supply = db.supply.find(c => c.id === id);

    if(!supply){
        return res.status(400).send('Supply no encontrado');
    }  

    Object.assign(supply, req.body);          
    writeData(db);
    res.json({supply: supply, message: 'Supply modificado con éxito'});
};


// Eliminar un suministro

const deleteSupply = async (req, res)=>{
    const db = await findData();
    const id = parseInt(req.params.id);

    const i = db.supply.length; 
    db.supply= db.supply.filter(u => u.id !== id);

    if (db.supply.length === i){
        return res.status(400).send('Supply no encontrado');
    } 
    writeData(db);
    res.status(200).json({message: 'Supply Borrado con éxito'}); 
};

const SupplyController = {
    saveSupply,
    findSupplies,
    findSupplyById,
    updateSupply,
    updateStockSupply,
    deleteSupply
}

export default SupplyController;