import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, 'Token non valide'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(403, 'Token invalide'));
        }
        req.user = user;
        next();
    });
}