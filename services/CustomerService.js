import Customer from '../models/Customer.js';


async function saveCustomerData({name, dni, phone, address}) {
    try {
        if (!name || !phone || !address) {
            throw new Error('Datos incompletos. Se requieren: name, dni, phone, address');
        }

        const found = await Customer.findOne({"dni": dni});
        if(found){
            throw new Error('Ya existe un Cliente con este DNI');
        }
        const customer = new Customer({
            name: name, 
            dni: dni, 
            phone: phone, 
            address: address
        });

        const saveCustomer = await customer.save();
        return saveCustomer;
    } catch (error) {
        throw new Error(error.message);
    }     
};

const listCustomers = async () =>{
    try {
        const customers = await Customer.find();
    return customers;
    } catch (error) {
        throw new Error(error.message);
    }
};

const findCustomerById = async (id) => {
    try {
        const customer = await Customer.findById(id);

    if(!customer){
        throw new Error('Customer no encontrado');
    }
    return customer;
    } catch (error) {
        throw new Error(error.message);
    }     
};

const findCustomerByDni = async (dni) => {
    try {
        const customer = await Customer.findOne({"dni": dni});
    if (!customer) throw new Error ('Cliente no encontrado');
    return customer;
    } catch (error) {
        throw new Error(error.message);
    }     
};


const updateCustomer = async (id, {name, dni, phone, address})=>{
    try {
        if (!name || !dni || !phone|| !address) {
            return {error: 'Datos incompletos. Se requieren: name, dni, phone, address' 
        };
    }
    const customer = await Customer.findByIdAndUpdate(id, {name, dni, phone, address}, {
        new: true,
        runValidators: true,
    });
    if(!customer){
        return {error: 'Cliente no encontrado'};
    }
    return {cliente: customer, message: 'Cliente modificado con éxito'};
    } catch (error) {
        throw new Error(error.message);
    }
};

async function deleteCustomer (id) {
    try {
        const deleteCustomer = await Customer.findByIdAndDelete(id);
        if (!deleteCustomer){
            return null;
        } 
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

const CustomerService = {
    saveCustomerData,
    listCustomers,
    findCustomerById,
    findCustomerByDni,
    updateCustomer,
    deleteCustomer,
};

export default CustomerService;