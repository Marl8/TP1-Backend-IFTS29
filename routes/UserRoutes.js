import express from 'express';
const router = express.Router();
import UserAPIController from '../controllers/UserAPIController.js';

router.get('/findUsers', UserAPIController.findUsersAPI);
router.get('/findUser/:id', UserAPIController.findUserByIdAPI);
router.get('/findUser', UserAPIController.findUserByDniAPI);
router.post('/saveUser/', UserAPIController.saveUserAPI);
router.put('/updateUser/:id', UserAPIController.updateUserAPI);
router.delete('/deleteUser/:id', UserAPIController.deleteUserAPI);
router.post('/login', UserAPIController.loginAPI);

export default router;