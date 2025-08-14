import {PrismaClient}  from "../generated/prisma/client.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const generateToken =(id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:'1d'});
}

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try{
        const existing = await prisma.user.findUnique({where: { email }});
        if (existing) return res.status(400).json({error: 'user exists'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data:{username, email, password: hashedPassword},
        });

        res.json({
            token: generateToken(user.id),
            user:{id: user.id, username: user.username, email:user.email},
        });

    }catch(error){
        console.log(error);
        res.status(500).json({error: "Registration failed"});
    }
};

export const login = async (req, res) => {
    const { email, password }  = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Invalid credentials' });

        res.json({
            token: generateToken(user.id),
            user: { id: user.id, username: user.username, email: user.email },
        });

    } catch (error) {
        res.status(500).json({ error: " login failed " });
    }
};

