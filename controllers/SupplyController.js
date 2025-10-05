import SupplyService from '../services/SupplyService.js';


// Guardar un suministro API

const saveSupplyAPI = async(req, res)=>{
    try {
        const saveSupply = await SupplyService.saveSupply(req.body);
        res.status(201).json({message: 'Suministro guardado con éxito', saveSupply});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }   
};


// Buscar todos los suministros API

const findSuppliesAPI = async(req, res) => {
    try {
        const supplies = await SupplyService.findSupplies();
        if(supplies.length !== 0){
            res.status(200).json(supplies);
        }else{
            res.status(400).json({message: 'No existen suministros'});
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }   
};


// Buscar suministro por id API

const findSupplyByIdAPI = async(req, res) => {
    try {
        const id = req.params.id;
        const supply = await SupplyService.findSupplyById(id);
        res.status(200).json(supply);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }   
};


// Actualizar suministro API

const updateSupplyAPI = async (req, res)=>{
    try{
        const id = req.params.id;
        const result = await SupplyService.updateSupply(id, req.body);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }
        res.status(200).json({ cliente: result.cliente, message: result.message });
    } catch (error) {
        res.status(400).json({message: error.message});
    }    
};


// Actualizar el stock del suministro API

const updateStockSupplyAPI = async (req, res)=>{
    try {
        const id = req.params.id;
        const {stock} = req.body;
        const result = await SupplyService.updateStockSupply(id, stock);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }
        res.json({supply: result.supply, message: 'Supply modificado con éxito'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


// Eliminar un suministro API

const deleteSupplyAPI = async (req, res)=>{
    try {
        const id = req.params.id;
        const result = await SupplyService.deleteSupply(id);
        if (!result){
            return res.status(400).json({error: 'Usuario no encontrado'});
        }
        res.status(200).json( {message: 'Borrado con éxito'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}    

const SupplyController = {
    saveSupplyAPI,
    findSuppliesAPI,
    findSupplyByIdAPI,
    updateSupplyAPI,
    updateStockSupplyAPI,
    deleteSupplyAPI,
}

export default SupplyController;