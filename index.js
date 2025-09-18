const express = require('express');
const app = express();
const PORT = 3000;
const CustomerRoutes = require('./routes/CustomerRoutes.js');
const WebCustomerRoutes = require('./routes/WebCustomerRoutes.js');


app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/api/customer', CustomerRoutes);

//Rutas Web
app.use('/', WebCustomerRoutes);

app.listen(PORT, ()=>{
    console.log(`servidor OK en el puerto ${PORT}`);
});