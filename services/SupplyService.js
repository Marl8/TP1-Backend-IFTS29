import Supply from '../models/Supply.js';


// Guardar un suministro 

const saveSupply = async({name, category, unitPrice, stock})=>{
    try {
        if (!name || !unitPrice || !category || !stock) {
        throw new Error('Datos incompletos. Se requieren: name, unitPrice, category, stock');
        }
        const found = await Supply.findOne({'name': name});

        if(found){
            throw new Error('Ya existe un item con este id');
        }
        const supply = new Supply({name, category, unitPrice, stock});
        const saveSupply = await supply.save();
        return saveSupply;
    } catch (error) {
        throw new Error(error.message);
    }    
};


// Buscar todos los suministros

const findSupplies = async() => {
    try {
        const supplies = await Supply.find();
    return supplies;
    } catch (error) {
        throw new Error(error.message);
    }   
};


// Buscar suministro por id

const findSupplyById = async(id) => {
    try {
        const supply = await Supply.findById(id);

    if(!supply){
        throw new Error('Supply no encontrado');
    }
    return supply;
    } catch (error) {
        throw new Error(error.message);
    }
};


// Actualizar suministro

const updateSupply = async (id, {name, category, unitPrice, stock})=>{
    try {
        if (!name || !unitPrice || !category || !stock) {
            return { error: 'Datos incompletos. Se requieren: name, unitPrice, category, stock'};
        }
        const supply = await Supply.findByIdAndUpdate(id, {name, category, unitPrice, stock}, {
            new: true,
            runValidators: true,
        });
        if(!supply){
            return {error: 'Supply no encontrado'};
        }  
        return {supply: supply, message: 'Supply modificado con éxito'};
    } catch (error) {
        throw new Error(error.message);
    }    
};


// Actualizar el stock del suministro

const updateStockSupply = async (id, stock)=>{
    try {
        const supply = await Supply.findById(id);
        if(!supply){
            return {error: 'Supply no encontrado'};
        }
        supply.stock = stock;
        const updatedSupply = await supply.save();
        return {supply: updatedSupply, message: 'Supply modificado con éxito'};
    } catch (error) {
        throw new Error(error.message);
    }    
};

// Eliminar un suministro

const deleteSupply = async (id)=>{
    try{
        const deletedSupply = await Supply.findByIdAndDelete(id); 
        if(!deletedSupply){
                return null;
            }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }  
};

const SupplyService = {
    saveSupply,
    findSupplies,
    findSupplyById,
    updateSupply,
    updateStockSupply,
    deleteSupply,
}

export default SupplyService;