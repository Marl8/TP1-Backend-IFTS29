import express from 'express';
const router = express.Router();
import RiderAPIController from '../controllers/RiderAPIController.js';

router.get('/findRiders', RiderAPIController.findRidersAPI);
router.get('/findRider/:id', RiderAPIController.findRiderByIdAPI);
router.get('/findRider', RiderAPIController.findRiderByDniAPI);
router.post('/saveRider', RiderAPIController.saveRiderAPI);
router.put('/updateRider/:id', RiderAPIController.updateRiderAPI);
router.patch('/updateStateRider/:id', RiderAPIController.updateRiderStateAPI);
router.delete('/deleteRider/:id', RiderAPIController.deleteRiderAPI);

export default router;