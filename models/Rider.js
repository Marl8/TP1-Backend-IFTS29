import mongoose from "mongoose";

const RiderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dni: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    vehicle: { 
        type: String, 
        required: true,
        enum: ['Moto', 'Bici', 'Auto'] 
    },
    patente: { type: String, default: 'N/A' }, 
    state: {
        type: String,
        enum: ['Disponible', 'Ocupado'],
        required: true
    }
});

RiderSchema.virtual('listOrders', {
    ref: 'DeliveryOrder',
    localField: '_id',
    foreignField: 'assignedRiderId',
});
    
const Rider = mongoose.model('Rider', RiderSchema);

export default Rider;