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
    res.status(201).json({message: 'Cliente guardado con éxito'});
};

exports.findCustomerById = async (req, res)=>{
    const db = findData();
    const id = parseInt(req.params.id);
    const customer = db.customer.find(c => c.id === id);
    if (!customer) {
            return res.status(400).json({ message: 'Cliente no encontrado' });
        }      
    res.status(200).json(customer);
};

// Actualizar cliente

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


// Eliminar cliente

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
