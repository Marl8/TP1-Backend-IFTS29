import Rider from '../models/Rider.js';

const saveRider = async ({name, dni, email, phone, state, vehicle, patente})=>{ 
    try {       
        if(!name || !dni || !email || !phone || !state || !vehicle){
            throw new Error('Datos incompletos. Se requieren: name, dni, email, phone, state y vehicle');
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            throw new Error('El nombre solo debe contener letras y espacios.');
        }
        if (!/^\d+$/.test(dni)) {
            throw new Error('El DNI solo debe contener números.');
        }
        if (!email.includes('@')) {
            throw new Error('El email debe ser válido (faltó el @).');
        }
        if (!/^\d+$/.test(phone)) {
            throw new Error('El teléfono solo debe contener números.');
        }
        const found = await Rider.findOne({'dni': dni});
        if(found){
            throw new Error('El repartidor ya existe');
        }
        const rider = new Rider({name, dni, email, phone, state, vehicle,
            patente: patente || 'N/A' 
        });
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
            return { riders: [], message: "No hay repartidores registrados en la base de datos." };
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


const findRiderByDni = async(dni)=>{
    try {
        const rider = await Rider.findOne({'dni': dni});
        if(!rider){
        throw new Error('No exiten repartidores registrados con ese DNI.');
        }
        return rider;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateRider = async(id, dataToUpdate)=> {
    try {
        const {name, dni, email, phone, state, vehicle, patente} = dataToUpdate; 
        
        if(!name || !dni || !email || !phone || !state || !vehicle){
            return ({error: 'Datos incompletos. Se requieren: name, dni, email, phone, state y vehicle'});
        }

        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return ({error: 'El nombre solo debe contener letras y espacios.'});
        }
        if (!/^\d+$/.test(dni)) {
            return ({error: 'El DNI solo debe contener números.'});
        }
        if (!email.includes('@')) {
            return ({error: 'El email debe ser válido (faltó el @).'});
        }
        if (!/^\d+$/.test(phone)) {
            return ({error: 'El teléfono solo debe contener números.'});
        }       
        const updatedRider = await Rider.findByIdAndUpdate(
            id,
            {name, dni, email, phone, state, vehicle, patente: patente || 'N/A'}, 
            { new: true, runValidators: true }
        );
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
    findRiderByDni,
    updateRider,
    updateStateRider,
    deleteRider,
};

export default RiderService;