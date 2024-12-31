// utils/jwt.js

import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_very_secure_secret_key';

export const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, username: user.username },
        SECRET_KEY
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;  // return null if the token is invalid or expired
    }
};
