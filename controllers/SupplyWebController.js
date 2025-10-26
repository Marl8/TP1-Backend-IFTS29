import Supply from '../models/Supply.js';
import SupplyService from '../services/SupplyService.js';

const showSupplyMenu = (req, res) => {
    try {
        res.render('supplyViews/supplyMenu', { 
            title: 'Insumos',
            query: req.query
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const showAddSupplyForm = (req, res) => {
    try {
        res.render('supplyViews/addSupply', { 
            title: 'Agregar Insumo',
            query: req.query 
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const listSupplysWeb = async (req, res) => {
    try {
        let supplys = []; 
        try {
             supplys = await SupplyService.findSupplies(); 
        } catch (findError) {
             if (!findError.message.includes('No hay insumos')) {
                 throw findError; 
             }
        }
        res.render('supplyViews/listSupplys', {
            title: 'Listado de Insumos',
            Supply: supplys,
            query: req.query 
        });
    } catch (error) {
         console.error("Error al listar los insumos:", error);
         res.status(500).render('errorView', {
             title: "Error",
             message: "No se pudieron cargar los insumos: " + error.message,
             query: req.query
         });
    }
};

const showSupplyToDelete = async (req, res) => {
    const idToFind = req.query.id; 
    let supply = null;
    let error = null;

    try {
        if (!idToFind) {
            return res.redirect('/supplys'); 
        }
        
        supply = await SupplyService.findSupplyById;
        
        if (!supply) {
            error = `Insumo con ID ${idToFind} no encontrado.`;
        }
        
        res.render('supplyViews/deleteSupply', { 
            title: 'Eliminar Insumo', 
            rider: rider,
            error: error,
            query: req.query
        });
    } catch (err) {
        res.render('supplyViews/deleteSupply', { 
            error: err.message, 
            rider: null,
            query: req.query
        });
    }
};

const SupplyWebController = {
    showSupplyMenu,
    showAddSupplyForm,
    listSupplysWeb,
    showSupplyToDelete
};

export default SupplyWebController;