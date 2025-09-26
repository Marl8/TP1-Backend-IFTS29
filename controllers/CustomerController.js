import Customer from '../models/Customer.js';
import {findData, writeData} from '../data/db.js';

// Guargar un nuevo cliente
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
const saveCustomerAPI = async (req, res) => {
    try {
        const customer = await saveCustomerData(req.body);
        res.status(201).json({ message: 'Cliente guardado con éxito', customer });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}; 

// -------------------- SAVE web ---------------------------
const saveCustomerWeb = async (req, res) => {
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
const listCustomers = async (req, res) =>{
    const db = findData();
    const customers = db.customer;
    res.render('listCustomers', {
    title: 'Listado de Clientes',
    customers
    })
}

// Buscar por ID, devuelvo customer
const findCustomerById = (id) => {
    const db = findData();
    const customer = db.customer.find(c => c.id === id);
    if (!customer) throw new Error ('Cliente no encontrado');

    return customer;
}

// ---------Res Buscar para API -----------
const findCustomerByIdAPI = (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const customer = findCustomerById(id);
        res.status(200).json(customer);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}

// ---------- Res Buscar para Web --------
const findCustomerByIdWeb = async (id) => {
    const db = findData();
    const customer = db.customer.find(c => c.id === id);
    if (!customer) {
        throw new Error('Cliente no encontrado');
    }
    return customer;
};

const showCustomerToEdit = async (req, res) => {
    const id = parseInt(req.query.id);
    let customer = null;
    let error = null;

    if (!isNaN(id)) {
        try {
            customer = await exports.findCustomerById(id);
        } catch (err) {
            error = err.message;
        }
    }

    res.render('updateCustomer', { id, customer, error });
};

const showCustomerToDelete = async (req, res) => {
    const id = parseInt(req.query.id);
    let customer = null;
    let error = null;

    if (!isNaN(id)) {
        try {
            customer = await exports.findCustomerById(id);
        } catch (err) {
            error = err.message;
        }
    }

    res.render('deleteCustomer', { id, customer, error });
};


// Actualizar cliente

const updateCustomer = (id, {name, phone, address})=>{
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
const updateCustomerAPI = async (req, res) => {
    const id = parseInt(req.params.id || req.body.id);
    const result = await exports.updateCustomer(id, req.body);

    if (result.error) {
        return res.status(400).json({ message: result.error });
    }

    res.status(200).json({ cliente: result.cliente, message: result.message });
};

//Actualiza para WEB
const updateCustomerWeb = async (req, res) => {
    const id = parseInt(req.params.id || req.body.id);
    const result = await exports.updateCustomer(id, req.body);

    if (result.error) {
        return res.render('editCustomer', { 
            title: 'Editar Cliente', 
            error: result.error,
            customer: { ...req.body, id }
        });
    }
    res.redirect(`/customers?success=${encodeURIComponent(result.message)}`);
};

// Eliminar cliente. 

async function deleteCustomer (id) {
    const db = findData();
    const i = db.customer.length; 
    db.customer = db.customer.filter(u => u.id !== id);

    if (db.customer.length === i){
        return null;
    } 
    writeData(db);
    return true;
}

const deleteCustomerAPI = async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await deleteCustomer(id);

    if (!result){
        return res.status(400).json({error: 'Usuario no encontrado'});
    }

    res.status(200).json( {message: 'Borrado con éxito'});
}

const deleteCustomerWeb = async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await deleteCustomer(id);

    if (!result) {
        return res.status(400).send('Usuario no encontrado');
    }

    res.redirect('/customers/list'); // vuelve al listado
};


const CustomerController = {
    saveCustomerAPI, 
    saveCustomerWeb,
    listCustomers,
    findCustomerByIdAPI,
    findCustomerByIdWeb,
    showCustomerToEdit,
    showCustomerToDelete,
    updateCustomerAPI,
    updateCustomerWeb,
    deleteCustomerAPI,
    deleteCustomerWeb
}

export default CustomerController;