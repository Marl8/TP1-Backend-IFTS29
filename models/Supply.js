import mongoose from "mongoose";

const SupplySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    menuItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
    }],
});

const Supply = mongoose.model('Supply', SupplySchema);
export default Supply;
