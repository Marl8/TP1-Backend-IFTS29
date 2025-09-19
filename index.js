const express = require('express');
const app = express();
const PORT = 3000;
const CustomerRoutes = require('./routes/CustomerRoutes.js');
const WebCustomerRoutes = require('./routes/WebCustomerRoutes.js');
const SupplyRoutes = require('./routes/SupplyRoutes.js');
const DeliveryOrderRoutes = require('./routes/DeliveryOrderRoutes.js');
const MenuItemRoutes = require('./routes/MenuItemRoutes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/api/menu', MenuItemRoutes);
app.use('/api/customer', CustomerRoutes);
app.use('/api/delivery-orders', DeliveryOrderRoutes);
app.use('/api/supply', SupplyRoutes);

//Rutas Web
app.use('/', WebCustomerRoutes);

app.listen(PORT, ()=>{
    console.log(`servidor OK en el puerto ${PORT}`);
});