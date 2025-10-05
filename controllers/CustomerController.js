import CustomerService from '../services/CustomerService.js';

// SAVE API 
const saveCustomerAPI = async (req, res) => {
    try {
        const customer = await CustomerService.saveCustomerData(req.body);
        res.status(201).json({ message: 'Cliente guardado con éxito', customer });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}; 

// SAVE web 
const saveCustomerWeb = async (req, res) => {
    try {
        await CustomerService.saveCustomerData(req.body);
        res.redirect('/customers?success=1');
    } catch (err) {
        res.render('addCustomer', {
            title: 'Agregar Cliente',
            error: err.message,
            oldData: req.body
        })
    }
};

// Listar todos los clientes API 

const listCustomersAPI = async (req, res)=>{
    try {
        const customers = await CustomerService.listCustomers();
        if(customers.length !== 0){
            res.status(200).json(customers);
        }else{
            res.status(400).json({message: 'No existen item'});
        }
    } catch (error) {
        res.status(400).json({message: err.message});
    }
}


// Listar todos los clientes Web 
const listCustomersWeb = async (req, res)=>{
    try {
        const customers = await CustomerService.listCustomers();
        res.render('listCustomers', {
        title: 'Listado de Clientes',
        customers
        })
    } catch (error) {
        throw new Error(error.message);
    }
}


// Buscar por id para API 
const findCustomerByIdAPI = async (req, res) => {
    try{
        const id = req.params.id;
        const customer = await CustomerService.findCustomerById(id);
        res.status(200).json(customer);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}

/*/ Buscar por id para Web
const findCustomerByIdWeb = async (id) => {
    try {
        const customer = await CustomerService.findCustomerById(id);
        return customer;
    } catch (error) {
        throw new Error(error.message);
    }   
};*/

const showCustomerToEdit = async (req, res) => {
    const id = req.query.id;
    let customer = null;
    let error = null;
    try {
        customer = await CustomerService.findCustomerById(id);
    } catch (err) {
        error = err.message;
        }
    res.render('updateCustomer', { id, customer, error });
};

const showCustomerToDelete = async (req, res) => {
    const id = req.query.id;
    let customer = null;
    let error = null;
    try {
        customer = await CustomerService.findCustomerById(id);
    } catch (err) {
        error = err.message;
    }
    res.render('deleteCustomer', { id, customer, error });
};


// Actualiza para API
const updateCustomerAPI = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await CustomerService.updateCustomer(id, req.body);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }
        res.status(200).json({ cliente: result.cliente, message: result.message });
    } catch (error) {
        res.status(400).json({message: err.message});
    }    
};

//Actualiza para WEB
const updateCustomerWeb = async (req, res) => {
    try {
        const id = req.body.id;
        const result = await CustomerService.updateCustomer(id, req.body);

        if (result.error) {
            return res.render('editCustomer', { 
                title: 'Editar Cliente', 
                error: result.error,
                customer: { ...req.body, id }
            });
        }
        res.redirect(`/customers?success=${encodeURIComponent(result.message)}`);
    } catch (error) {
        throw new Error(error.message);
    }    
};


// Delete para API
const deleteCustomerAPI = async (req, res) => {
    try {
        const id = req.params.id;
    const result = await CustomerService.deleteCustomer(id);

    if (!result){
        return res.status(400).json({error: 'Usuario no encontrado'});
    }
    res.status(200).json( {message: 'Borrado con éxito'});
    } catch (error) {
        throw new Error(error.message);
    }
}

// Delete para Web
const deleteCustomerWeb = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await CustomerService.deleteCustomer(id);
        if (!result) {
            return res.status(400).send('Usuario no encontrado');
        }
        res.redirect('/customers/list'); // vuelve al listado
    } catch (error) {
        throw new Error(error.message);
    }
};

const CustomerController = {
    saveCustomerAPI, 
    saveCustomerWeb,
    listCustomersAPI,
    listCustomersWeb,
    findCustomerByIdAPI,
    showCustomerToEdit,
    showCustomerToDelete,
    updateCustomerAPI,
    updateCustomerWeb,
    deleteCustomerAPI,
    deleteCustomerWeb
}

export default CustomerController;
