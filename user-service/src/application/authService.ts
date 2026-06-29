import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../infrastructure/database/db';
import { usuarios } from '../../../task-service/src/infrastructure/database/schema';


const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_para_clase';

export class AuthService {
    async register(nombre: string, email: string, pass: string) {
        const hashedPassword = await bcrypt.hash(pass, 10);
        
        await db.insert(usuarios).values({
            id: crypto.randomUUID(),
            nombreUsuario: nombre,
            email: email,
            password: hashedPassword
        });
        
        return { mensaje: "Usuario registrado con éxito" };
    }
    async login(email: string, pass: string) {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        return { token };
    }
}