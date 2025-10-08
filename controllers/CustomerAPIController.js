import CustomerService from '../services/CustomerService.js';

// SAVE API 
const saveCustomerAPI = async (req, res) => {
    try {
        const customer = await CustomerService.saveCustomerData(req.body);
        res.status(201).json({ message: 'Cliente guardado con éxito', customer });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
        res.status(400).json({message: error.message});
    }
}


// Buscar por id para API 
const findCustomerByIdAPI = async (req, res) => {
    try{
        const id = req.params.id;
        const customer = await CustomerService.findCustomerById(id);
        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}


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
        res.status(400).json({message: error.message});
    }    
};


// Delete para API
const deleteCustomerAPI = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await CustomerService.deleteCustomer(id);

        if (!result){
            return res.status(400).json({error: 'Cliente no encontrado'});
        }
        res.status(200).json( {message: 'Borrado con éxito'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

const CustomerAPIController = {
    saveCustomerAPI,
    listCustomersAPI,
    findCustomerByIdAPI,
    updateCustomerAPI,
    deleteCustomerAPI,
}

export default CustomerAPIController;
