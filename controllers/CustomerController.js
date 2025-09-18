const Customer = require('../models/Customer.js');
const {findData, writeData} = require('../data/db.js');


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
}

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

// exports.saveCustomer = async (req, res)=>{
//     const db = findData();
//     const {id, name, phone, address} = req.body;

//     if (!id || !name || !phone|| !address) {
//             return res.status(400).json({ 
//                 message: 'Datos incompletos. Se requieren: id, name, phone, address' 
//         });
//     }
//     const found = db.customer.filter(u => u.id === id);

//     if(found.length !== 0){
//         return res.status(400).json({ message: 'Ya existe un Cliente con este id' });
//     }
//     const customer = new Customer(id, name, phone, address);
//     const customerDto = {
//         id: customer.getId(),
//         name: customer.getName(),
//         phone: customer.getPhone(),
//         address: customer.getAddress()
//     };    
//     db.customer.push(customerDto);
//     writeData(db);
//     res.status(201).json({message: 'Cliente guardado con éxito'});
// };

// Listar Clientes
exports.listCustomers = async (req, res) =>{
    const db = findData();
    const customers = db.customer;
    res.render('listCustomers', {
    title: 'Listado de Clientes',
    customers
   })
}

exports.findCustomerById = async (req, res)=>{
    const db = findData();
    const id = parseInt(req.params.id);
    const customer = db.customer.find(c => c.id === id);
    if (!customer) {
            return res.status(400).json({ message: 'Cliente no encontrado' });
        }      
    res.status(200).json(customer);
};

exports.updateCustomer = async (req, res)=>{
    const db = findData();
    const id = parseInt(req.params.id);
    const index = db.customer.findIndex(c => c.id === id);

    const {name, phone, address} = req.body;
    if (!name || !phone|| !address) {
            return res.status(400).json({ 
                message: 'Datos incompletos. Se requieren: id, name, phone, address' 
        });
    }

    if(index === -1){
        return res.status(400).send('Usuario no encontrado');
    }
    
    db.customer[index] = { 
        id, 
        name: name,
        phone: phone,
        address: address 
        };          
    writeData(db);
    res.status(200).json({cliente: db.customer[index], message: 'Cliente modificado con éxito'});
};

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
