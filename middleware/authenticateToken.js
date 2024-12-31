import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.js';

export const authenticateToken = (req, res, next) => {
    try{
        const payload=verifyToken(req.cookies['token'], process.env.JWT_SECRET);
        res.locals=payload;
        console.log('Payload:',payload);
        return next();
    }
    catch (error) {
    console.error('Error authenticating token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
}};

