import RiderService from '../services/RiderService.js';
import { getNextSequence } from '../models/CounterModel.js'; 
import CustomerService from '../services/CustomerService.js'; 

const showRiderMenu = (req, res) => {
    try {
        res.render('riderViews/riderMenu', { 
            title: 'Repartidores',
            query: req.query
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const showAddRiderForm = (req, res) => {
    try {
        res.render('riderViews/addRider', { 
            title: 'Agregar Repartidor',
            query: req.query 
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const saveRiderWeb = async (req, res) => {
    try {
        if (!/^[a-zA-Z\s]+$/.test(req.body.name)) {
            throw new Error('El nombre solo debe contener letras y espacios.');
        }
        if (!/^\d+$/.test(req.body.dni)) {
            throw new Error('El DNI solo debe contener números.');
        }
        if (!req.body.email.includes('@')) {
            throw new Error('El email debe ser válido (faltó el @).');
        }
        if (!/^\d+$/.test(req.body.phone)) {
            throw new Error('El teléfono solo debe contener números.');
        }

        await RiderService.saveRider(req.body); 
        res.redirect('/riders?success=true'); 
    } catch (error) {
        const errorMessage = encodeURIComponent(error.message);
        res.redirect(`/riders/add?error=${errorMessage}`);
    }
};

const listRidersWeb = async (req, res) => {
    try {
        let riders = []; 
        try {
             riders = await RiderService.findAllRiders(); 
        } catch (findError) {
             if (!findError.message.includes('No hay repartidores')) {
                 throw findError; 
             }
        }
       
        res.render('riderViews/listRiders', {
            title: 'Listado de Repartidores',
            riders: riders,
            query: req.query 
        });
    } catch (error) {
         console.error("Error al listar repartidores:", error);
         res.status(500).render('errorView', {
             title: "Error",
             message: "No se pudieron cargar los repartidores: " + error.message,
             query: req.query
         });
    }
};


const showRiderToEdit = async (req, res) => {
    const id = req.query.id; 
    let rider = null;
    let error = null;
    try {
        if (id) {
            rider = await RiderService.findRiderById(id);
        }
    } catch (err) {
        error = err.message;
    }
    res.render('riderViews/updateRider', { 
        title: 'Editar Repartidor', 
        id: id,     
        rider: rider, 
        error: error,
        query: req.query
    });
};

const updateRiderWeb = async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!/^[a-zA-Z\s]+$/.test(req.body.name)) {
             throw new Error('El nombre solo debe contener letras y espacios.');
        }
        if (!/^\d+$/.test(req.body.dni)) {
             throw new Error('El DNI solo debe contener números.');
        }
        if (!req.body.email.includes('@')) {
             throw new Error('El email debe ser válido (faltó el @).');
        }
        if (!/^\d+$/.test(req.body.phone)) {
             throw new Error('El teléfono solo debe contener números.');
        }

        await RiderService.updateRider(id, req.body); 
        res.redirect('/riders/list');
    } catch (error) {
        res.render('riderViews/updateRider', {
            title: 'Editar Repartidor',
            error: error.message,
            rider: { ...req.body, riderId: req.params.id }, 
            query: req.query
        });
    }
};

const showRiderToDelete = async (req, res) => {
    const idToFind = req.query.id; 
    let rider = null;
    let error = null;

    try {
        if (!idToFind) {
            return res.redirect('/riders'); 
        }
        
        rider = await RiderService.findRiderById(idToFind);
        
        if (!rider) {
            error = `Repartidor con ID ${idToFind} no encontrado.`;
        }
        
        res.render('riderViews/deleteRider', { 
            title: 'Eliminar Repartidor', 
            rider: rider,
            error: error,
            query: req.query
        });
    } catch (err) {
        res.render('riderViews/deleteRider', { 
            error: err.message, 
            rider: null,
            query: req.query
        });
    }
};

const deleteRiderWeb = async (req, res) => {
    try {
        const id = req.params.id; 
        await RiderService.deleteRider(id); 
        res.redirect('/riders/list?success=eliminado'); 
    } catch (error) {
        const errorMessage = encodeURIComponent(error.message);
        res.redirect(`/riders/delete?id=${req.params.id}&error=${errorMessage}`);
    }
};

const RiderWebController = {
    showRiderMenu,
    showAddRiderForm,
    saveRiderWeb,
    listRidersWeb,
    showRiderToEdit,
    updateRiderWeb,
    showRiderToDelete,
    deleteRiderWeb
};

export default RiderWebController;