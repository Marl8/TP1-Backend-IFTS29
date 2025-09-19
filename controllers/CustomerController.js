const Customer = require('../models/Customer.js');
const {findData, writeData} = require('../data/db.js');


// Guargar un nuevo cliente

// Separo la lógica del negocio de la respuesta.
// En un futuro deberíamos implementar Services para mejorar el proyecto.
async function saveCustomerData({id, name, phone, address}) {
    const db = findData();
    const numericId = parseInt(id);

    if (!numericId || !name || !phone || !address) {
        throw new Error('Datos incompletos. Se requieren: id, name, phone, address');
    }

    const found = db.customer.filter(u => u.id === numericId);
    if (found.length !== 0) {
        throw new Error('Ya existe un Cliente con este id');
    }

    const customer = new Customer(numericId, name, phone, address);
    const customerDto = {
        id: customer.getId(),
        name: customer.getName(),
        phone: customer.getPhone(),
        address: customer.getAddress()
    };

    db.customer.push(customerDto);
    writeData(db);
    
        return customerDto;
};

// -------------------- SAVE API ---------------------------
exports.saveCustomerAPI = async (req, res) => {
    try {
        const customer = await saveCustomerData(req.body);
        res.status(201).json({ message: 'Cliente guardado con éxito', customer });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}; 

// -------------------- SAVE web ---------------------------
exports.saveCustomerWeb = async (req, res) => {
    try {
        await saveCustomerData(req.body);
        res.redirect('/customers?success=1');
    } catch (err) {
        res.render('addCustomer', {
            title: 'Agregar Cliente',
            error: err.message,
            oldData: req.body
        })
    }
};

// Listar Clientes
exports.listCustomers = async (req, res) =>{
    const db = findData();
    const customers = db.customer;
    res.render('listCustomers', {
    title: 'Listado de Clientes',
    customers
   })
}

// Buscar por ID, devuelvo customer
exports.findCustomerById = (id) => {
    const db = findData();
    const customer = db.customer.find(c => c.id === id);
    if (!customer) throw new Error ('Cliente no encontrado');

    return customer;
}

// ---------Res Buscar para API -----------
exports.findCustomerByIdAPI = (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const customer = exports.findCustomerById(id);
        res.status(200).json(customer);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}

// ---------- Res Buscar para Web --------
exports.findCustomerByIdWeb = async (req, res) => {
    const id = parseInt(req.query.id) ; // viene del input del formulario
    let customer = null;
    let error = null;

    // Solo busco si realmente vino un id
    if (!isNaN(id)) {
        try {
            customer = await exports.findCustomerById(id);
        } catch (err) {
            error = err.message; // "Cliente no encontrado"
        }
    }

    res.render('updateCustomer', { 
        title: 'Editar Cliente', 
        customer, 
        error 
    });
};


// Actualizar cliente

exports.updateCustomer = (id, {name, phone, address})=>{
    const db = findData();
    const index = db.customer.findIndex(c => c.id === id);
    if (!name || !phone|| !address) {
            return {error: 'Datos incompletos. Se requieren: id, name, phone, address' 
        };
    }
    if(index === -1){
        return {error: 'Usuario no encontrado'};
    }
    db.customer[index] = { 
        id, 
        name: name,
        phone: phone,
        address: address 
        };          
    writeData(db);
    return {cliente: db.customer[index], message: 'Cliente modificado con éxito'};
};


// Actualiza para API
exports.updateCustomerAPI = async (req, res) => {
    const id = parseInt(req.params.id || req.body.id);
    const result = await exports.updateCustomer(id, req.body);

    if (result.error) {
        return res.status(400).json({ message: result.error });
    }

    res.status(200).json({ cliente: result.cliente, message: result.message });
};

//Actualiza para WEB
exports.updateCustomerWeb = async (req, res) => {
    const id = parseInt(req.params.id || req.body.id);
    const result = await exports.updateCustomer(id, req.body);

    if (result.error) {
        // Si hay error, volvemos al formulario de edición con alert
        return res.render('editCustomer', { 
            title: 'Editar Cliente', 
            error: result.error,
            customer: { ...req.body, id }
        });
    }

    // Si todo OK, redirigimos a la lista de clientes con mensaje de éxito
    res.redirect(`/customers?success=${encodeURIComponent(result.message)}`);
};

// Eliminar cliente. TODO: plantilla

exports.deleteCustomer = async (req, res)=>{
    const db = findData();
    const id = parseInt(req.params.id);
    const i = db.customer.length; 
    db.customer = db.customer.filter(u => u.id !== id);

    if (db.customer.length === i){
        return res.status(400).send('Usuario no encontrado');
    } 
    writeData(db);
    res.status(200).json({message: 'Borrado con éxito'}); 
};
