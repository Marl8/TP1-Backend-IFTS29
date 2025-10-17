import Rider from '../models/Rider.js';

const saveRider = async ({name, dni, email, phone, state})=>{
    try {
        if(!name || !dni || !email || !phone || !state){
            throw new Error('Datos incompletos. Se requieren: name, dni, phone, state');
        }
        const found = await Rider.findOne({'dni': dni});
        if(found){
            throw new Error('El repartidor ya existe');
        }
        const rider = new Rider({name: name, dni: dni, email: email, phone: phone, state: state});
        const savedRider = await rider.save();
        return savedRider;
    } catch (error) {
        throw new Error(error.message);
    }   
};

const findAllRiders = async()=>{
    try {
        const riders = await Rider.find();
    if(riders.length === 0){
        throw new Error('No hay repartidores registrados en la base de datos.');
    }
    return riders;
    } catch (error) {
        throw new Error(error.message);
    }  
};


const findRiderById = async(id)=>{
    try {
        const rider = await Rider.findById(id);
        if(!rider){
        throw new Error('No exiten repartidores registrados con ese id.');
        }
        return rider;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateRider = async(id, {name, dni, email, phone, state})=> {
    try {
        if(!name || !dni || !email || !phone || !state){
        return ({error: 'Datos incompletos. Se requieren: name, dni, phone, state'});
        }
        const updatedRider = await Rider.findByIdAndUpdate(id, {name, dni, email, phone, state}, {
            new: true,
            runValidators: true,
        });
        if(!updatedRider){
            return {error: 'Repartidor no encontrado'};
        }
        return {repartidor: updatedRider, message: 'Repartidor modificado con éxito'};
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateStateRider = async(id)=> {
    try {
        if(!id){
        return ({error: 'Datos incompletos.'});
        }
        const rider = await Rider.findById(id);
        if(!rider){ 
            return {error: 'Repartidor no encontrado'};
        }
        if(rider.state === 'Disponible'){
            rider.state = 'Ocupado';
        }else{
            rider.state = 'Disponible';
        }
        const updatedRider = await rider.save();
        return {repartidor: updatedRider, message: 'Estado del repartidor modificado con éxito'};
    } catch (error) {
        throw new Error(error.message);
    }
};


async function deleteRider(id) {
    try {
        const deleteRider = await Rider.findByIdAndDelete(id);
        if (!deleteRider){
            return null;
        } 
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

const RiderService = {
    saveRider,
    findAllRiders,
    findRiderById,
    updateRider,
    updateStateRider,
    deleteRider,
};

export default RiderService;