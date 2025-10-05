import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dni: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
});
    
customerSchema.virtual('listOrders', {
    ref: 'DeliveryOrder',
    localField: '_id',
    foreignField: 'customerId',
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;