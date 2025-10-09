import User from '../models/User.js';

const saveUser = async({name, dni, email, username, password, rol})=>{
    try {
        if(!name || !dni || !email || !username || !password || !rol){
            throw new Error('Datos incompletos. Se requieren: name, dni, email, username, password, rol');
        }
        const found = await User.findOne({'dni': dni});
        if(found){
            throw new Error('El usuario ya existe');
        }
        const user = new User({
            name: name,
            dni: dni,
            email: email,
            username: username,
            password: password,
            rol: rol,
        });
        const savedUser = await user.save();
        return savedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

const findAllUsers = async()=>{
    try {
        const users = await User.find();
        if(users.length === 0) {
            throw new Error('No hay usuarios registrados en el sistema');
        }
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
};

const findUserById = async(id)=>{
    try {
        const user = User.findById(id);
        if(!user){
            throw new Error('Usuario no encontrado');
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateUser = async(id, {name, dni, email, username, password, rol})=>{
    try {
        if(!name || !dni || !email || !username || !password || !rol){
            return {error: 'Datos incompletos. Se requieren: name, dni, email, username, password, rol'};
        }
        const updatedUser = await User.findByIdAndUpdate(id, {name, dni, email, username, password, rol}, 
            {
                new: true,
            runValidators: true,
            }
        );
        if(!updatedUser){
            return {error: 'Usuario no encontrado'};
        }
        return {user: updatedUser, message: 'User modificado con éxito'};
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteUser = async(id)=>{
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser){
            return null;
        } 
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

const UserService = {
    saveUser,
    findAllUsers,
    findUserById,
    updateUser,
    deleteUser,
};

export default UserService;