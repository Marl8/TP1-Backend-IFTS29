import mongoose from "mongoose";

const deliveryOrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
    }],
    status: {
        type: String,
        enum: ['preparing', 'pending', 'dispatched'], 
        default: 'preparing',
        required: true
    },
    total: {type: Number, required: true},
    assignedRiderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rider',
    },
    estimatedTime: {type: Date, required: false },
    plataforma: {type: String, default: 'Propia'},
});

const DeliveryOrder = mongoose.model('DeliveryOrder', deliveryOrderSchema);

export default DeliveryOrder;


