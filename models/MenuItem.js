import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    supplies: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supply',
    }],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
