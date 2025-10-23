import CustomerService from '../services/CustomerService.js';


// SAVE web 
const saveCustomerWeb = async (req, res) => {
    try {
        await CustomerService.saveCustomerData(req.body);
        res.redirect('/customers?success=1');
    } catch (err) {
        res.render('customersViews/addCustomer', {
            title: 'Agregar Cliente',
            error: err.message,
            oldData: req.body
        })
    }
};


// Listar todos los clientes Web 
const listCustomersWeb = async (req, res)=>{
    try {
        const customers = await CustomerService.listCustomers();
        res.render('customersViews/listCustomers', {
        title: 'Listado de Clientes',
        customers
        })
    } catch (error) {
        throw new Error(error.message);
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
    res.render('customersViews/updateCustomer', { id, customer, error });
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
    res.render('customersViews/deleteCustomer', { id, customer, error });
};


//Actualiza para WEB
const updateCustomerWeb = async (req, res) => {
    try {
        const id = req.body.id;
        const result = await CustomerService.updateCustomer(id, req.body);

        if (result.error) {
            return res.render('customersViews/editCustomer', { 
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

const CustomerWebController = {
    saveCustomerWeb,
    listCustomersWeb,
    showCustomerToEdit,
    showCustomerToDelete,
    updateCustomerWeb,
    deleteCustomerWeb
}

export default CustomerWebController;
