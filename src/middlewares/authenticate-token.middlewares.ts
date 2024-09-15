import { NextFunction, Request, Response } from 'express';
import { envs } from '../config/env';
import jwt from 'jsonwebtoken';

export const AuthenticateToken = (request: Request, response: Response, next: NextFunction) => {
    const jwtSecret = envs.JWT_SECRET;
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return response.status(401).json({message: 'Not Unauthorized'});

    jwt.verify(token, jwtSecret, (error, user)=>{
        if(error) return response.status(401).json({message: 'Forbidden'});
        (request as any).user = user;
        next();
    });  
}