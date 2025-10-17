import RiderService from '../services/RiderService.js';


// Save Repartidor API

const saveRiderAPI = async(req, res)=>{
    try {
        const rider = await RiderService.saveRider(req.body);
        res.status(201).json({ message: 'Cliente guardado con éxito', rider });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Find all Repartidores API

const findRidersAPI = async(req, res)=>{
    try {
        const riders = await RiderService.findAllRiders();
        if(riders.length !== 0){
            res.status(200).json(riders);
        }else{
            res.status(400).json({message: 'No existen item'});
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Find by Id Repartidor API

const findRiderByIdAPI = async(req, res)=>{
    try {
        const id = req.params.id;
        const rider = await RiderService.findRiderById(id);
        res.status(200).json(rider);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Update Rider API

const updateRiderAPI = async(req, res)=>{
    try {
        const id = req.params.id;
        const result = await RiderService.updateRider(id, req.body);
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }
        res.status(200).json({ repartidor: result.repartidor, message: result.message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Update Rider State API

const updateRiderStateAPI = async(req, res)=>{
    try {
        const id = req.params.id;
        const result = await RiderService.updateStateRider(id);
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }
        res.status(200).json({ repartidor: result.repartidor, message: result.message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Delete Rider API

const deleteRiderAPI = async(req, res)=>{
    try {
        const id = req.params.id;
        const result = await RiderService.deleteRider(id);

        if (!result){
            return res.status(400).json({error: 'Repartidor no encontrado'});
        }
        res.status(200).json( {message: 'Borrado con éxito'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const RiderAPIController = {
    saveRiderAPI,
    findRidersAPI,
    findRiderByIdAPI,
    updateRiderAPI,
    updateRiderStateAPI,
    deleteRiderAPI,
};

export default RiderAPIController;