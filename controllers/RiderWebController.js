import RiderService from '../services/RiderService.js';

// ====== Muestra el menú principal de Repartidores ========== 
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

// ============= Muestra el formulario para agregar un nuevo repartidor =============
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

//  =========== Guarda el nuevo repartidor (desde el formulario)   =============
const saveRiderWeb = async (req, res) => {
    try {
        await RiderService.saveRider(req.body); 
        res.redirect('/riders?success=true');
    } catch (error) {
        const errorMessage = encodeURIComponent(error.message);
        res.redirect(`/riders/add?error=${errorMessage}`);
    }
};

// ========  Muestra la lista de todos los repartidores  =================== 
const listRidersWeb = async (req, res) => {
    try {
        const riders = await RiderService.findAllRiders(); 
        res.render('riderViews/listRiders', {
            title: 'Listado de Repartidores',
            riders: riders
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// ======== Muestra la página para EDITAR un repartidor (con buscador) ========
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
        error: error
    });
};

// ======== PROCESA la edición del repartidor ========
const updateRiderWeb = async (req, res) => {
    try {
        const id = req.params.id;
        await RiderService.updateRider(id, req.body); 
        res.redirect('/riders/list');
    } catch (error) {
        res.render('riderViews/updateRider', {
            title: 'Editar Repartidor',
            error: error.message,
            rider: { ...req.body, _id: req.params.id } 
        });
    } 
}; 

// ======== Muestra la página para ELIMINAR un repartidor (con buscador) ========
const showRiderToDelete = async (req, res) => {
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

    res.render('riderViews/deleteRider', { 
        title: 'Eliminar Repartidor', 
        id: id,
        rider: rider,
        error: error
    }); 
};

// ======== PROCESA la eliminación del repartidor ========
const deleteRiderWeb = async (req, res) => {
    try {
        const id = req.params.id; 
        await RiderService.deleteRider(id); 
        res.redirect('/riders/list'); 
    } catch (error) {
        res.render('riderViews/deleteRider', {
            title: 'Eliminar Repartidor',
            error: error.message,
            id: req.params.id
        });
    }
};

// === Exportamos TODAS las funciones  ===== 
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