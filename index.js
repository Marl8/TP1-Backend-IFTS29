import express from 'express';
import dotenv from "dotenv";
import methodOverride from 'method-override';

// Rutas
import CustomerRoutes from './routes/CustomerRoutes.js';
import WebCustomerRoutes from './routes/WebCustomerRoutes.js';
import SupplyRoutes from './routes/SupplyRoutes.js';
import DeliveryOrderRoutes from './routes/DeliveryOrderRoutes.js';
import WebDeliveryRoutes from './routes/WebDeliveryRoutes.js';
import MenuItemRoutes from './routes/MenuItemRoutes.js';
import RiderRoutes from './routes/RiderRoutes.js';
import UserRoutes from './routes/UserRoutes.js';
import WebRiderRoutes from './routes/WebRiderRoutes.js';

// Conexión a MongoDB
import { connectDB } from './data/MongoConnection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Rutas API
app.use('/api/menu', MenuItemRoutes);
app.use('/api/customer', CustomerRoutes);
app.use('/api/delivery-orders', DeliveryOrderRoutes);
app.use('/api/supply', SupplyRoutes);
app.use('/api/rider', RiderRoutes);
app.use('/api/user', UserRoutes);

// Rutas Web
app.use('/', WebCustomerRoutes);       
app.use('/delivery', WebDeliveryRoutes); 
app.use('/riders', WebRiderRoutes);

// Función para iniciar servidor
const startServer = async () => {
  try {
    await connectDB(); // Espera a que MongoDB esté conectado
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo iniciar el servidor:", error.message);
  }
};

startServer();


/*import express from 'express';
import dotenv from "dotenv";
import methodOverride from 'method-override';
import CustomerRoutes from './routes/CustomerRoutes.js';
import WebCustomerRoutes from './routes/WebCustomerRoutes.js';
import SupplyRoutes from './routes/SupplyRoutes.js';
import DeliveryOrderRoutes from './routes/DeliveryOrderRoutes.js';
import WebDeliveryRoutes from './routes/WebDeliveryRoutes.js';
import MenuItemRoutes from './routes/MenuItemRoutes.js';
import RiderRoutes from './routes/RiderRoutes.js';
import UserRoutes from './routes/UserRoutes.js';
import { connectDB } from './data/MongoConnection.js';
import WebRiderRoutes from './routes/WebRiderRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(methodOverride('_method'));

app.set('view engine', 'pug');
app.set('views', './views');

//Rutas API
app.use('/api/menu', MenuItemRoutes);
app.use('/api/customer', CustomerRoutes);
app.use('/api/delivery-orders', DeliveryOrderRoutes);
app.use('/api/supply', SupplyRoutes);
app.use('/api/rider', RiderRoutes);
app.use('/api/user', UserRoutes);

//Rutas Web
app.use('/', WebCustomerRoutes);       
app.use('/delivery', WebDeliveryRoutes); 
app.use('/riders', WebRiderRoutes);

app.listen(PORT, ()=>{
    connectDB();
    console.log(`servidor OK en el puerto ${PORT}`);
});*/