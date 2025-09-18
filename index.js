const express = require('express');
const app = express();
const PORT = 3000;
const CustomerRoutes = require('./routes/CustomerRoutes.js')


app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/api/menu', MenumItemRoutes);
app.use('/api/customer', CustomerRoutes);

app.listen(PORT, ()=>{
    console.log(`servidor OK en el puerto ${PORT}`);
});