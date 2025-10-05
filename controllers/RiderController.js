// Prueba rápida en tu código de inicialización o en una ruta temporal
import Rider from './models/Rider.js';
import User from './models/User.js';

// Después de conectar a MongoDB:
async function testCollections() {
    try {
        // Crear un rider de prueba
        await Rider.create({
            name: "Juan Pérez",
            dni: "12345678",
            email: "juan@example.com",
            phone: "+5491112345678",
            status: "Disponible"
        });

        // Crear un usuario de prueba
        await User.create({
            name: "Admin Test",
            dni: "87654321",
            email: "admin@example.com",
            rol: "Admin"
        });

        console.log("✅ Colecciones creadas exitosamente");
        console.log(mongoose.modelNames());
    
    } catch (error) {
        console.error("Error creando colecciones:", error);
    }
}

testCollections();