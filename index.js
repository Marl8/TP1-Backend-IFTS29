import express from 'express';
const app = express();
const PORT = 3000;
import methodOverride from 'method-override';
import CustomerRoutes from './routes/CustomerRoutes.js';
import WebCustomerRoutes from './routes/WebCustomerRoutes.js';
import SupplyRoutes from './routes/SupplyRoutes.js';
import DeliveryOrderRoutes from './routes/DeliveryOrderRoutes.js';
import MenuItemRoutes from './routes/MenuItemRoutes.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(methodOverride('_method'));

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