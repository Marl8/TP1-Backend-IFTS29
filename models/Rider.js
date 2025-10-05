import mongoose from "mongoose";

const RiderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dni: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
        type: String,
        enum: ['Disponible', 'Ocupado'],
    }
});

RiderSchema.virtual('listOrders', {
    ref: 'DeliveryOrder',
    localField: '_id',
    foreignField: 'assignedRiderId',
});

    
const Rider = mongoose.model('Rider', RiderSchema);

export default Rider;