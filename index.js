const express = require('express');
const app = express();
const PORT = 3000;
const CustomerRoutes = require('./routes/CustomerRoutes.js')
const MenumItemRoutes = require('./routes/MenuItemRoutes.js')
const SupplyRoutes = require('./routes/SupplyRoutes.js')
const DeliveryOrderRoutes = require('./routes/DeliveryOrderRoutes.js')

app.use(express.json());

app.use('/api/menu', MenumItemRoutes);
app.use('/api/customer', CustomerRoutes);
app.use('/api/supply', SupplyRoutes);
app.use('/api/delivery-orders', DeliveryOrderRoutes);

app.listen(PORT, ()=>{
    console.log(`servidor OK en el puerto ${PORT}`);
});