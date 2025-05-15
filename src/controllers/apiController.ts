import { Request, Response } from 'express';
import { User } from '../models/User';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const ping = (req: Request, res: Response) => {
    res.json({ pong: true });
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'E-mail e/ou senha não enviados.' });
        }

        const hasUser = await User.findOne({ where: { email } });

        if (hasUser) {
            return res.status(409).json({ error: 'E-mail já existe.' });
        }

        const newUser = await User.create({ email, password });
        const token = JWT.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '2h' }
        );

        return res.status(201).json({ id: newUser.id, token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};

export const login = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await User.findOne({
            where: { email, password }
        });

        if (user) {
            const token = JWT.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '2h' }
            );

            res.json({ status: true, token });
            return;
        }
    }

    res.json({ status: false });
}

export const list = async (req: Request, res: Response) => {
    let users = await User.findAll();
    let list: string[] = [];

    for (let i in users) {
        list.push(users[i].email);
    }

    res.json({ list });
}