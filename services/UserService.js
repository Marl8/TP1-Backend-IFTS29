import bcrypt from 'bcrypt'; 
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
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({
            name: name,
            dni: dni,
            email: email,
            username: username,
            password: hashedPassword,
            rol: rol,
        });
        const savedUser = await user.save();
        if(savedUser){
            const userDto = {
                name: savedUser.name,
                dni: savedUser.dni,
                email: savedUser.email,
                username: savedUser.username,
                rol: savedUser.rol,
            }
            return userDto;
        }else{
            throw new Error('Ocurrió un error en el guardado');
        }        
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
        const listUsers = users.map(us => {
            const userDto = {
                id: us.id,
                name: us.name,
                dni: us.dni,
                email: us.email,
                username: us.username,
                rol: us.rol,
            }
            return userDto;
        })
        return listUsers;
    } catch (error) {
        throw new Error(error.message);
    }
};

const findUserById = async(id)=>{
    try {
        const user = await User.findById(id);
        if(!user){
            throw new Error('Usuario no encontrado');
        }
        const userDto = {
            id: user.id,
            name: user.name,
            dni: user.dni,
            email: user.email,
            username: user.username,
            rol: user.rol,
            }
        return userDto;
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
        return {message: 'User modificado con éxito'};
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

const loginUser = async ({username, password}) => {
    try {
        if (!username || !password) {
        throw new Error('Faltan datos: username y password son obligatorios');
        }
        const user = await User.findOne({ username });
        if (!user) {
        throw new Error('Usuario no encontrado');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        throw new Error('Contraseña incorrecta');
        }
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        return {islogin: true, user: userWithoutPassword};
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
    loginUser
};

export default UserService;