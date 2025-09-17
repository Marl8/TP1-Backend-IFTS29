const express = require('express');
const app = express();
const PORT = 3000;
const CustomerRoutes = require('./routes/CustomerRoutes.js')
const DeliveryOrderRoutes = require('./routes/DeliveryOrderRoutes');


app.use(express.json());

app.use('/api/customer', CustomerRoutes);
app.use('/api/delivery-orders', DeliveryOrderRoutes);


app.listen(PORT, ()=>{
    console.log(`servidor OK en el puerto ${PORT}`);
});