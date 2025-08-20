import jwt from 'jsonwebtoken';
import User from '../model/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

export  function authenticateJWT(req, res, next) {
    const token = req.cookies.access_token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Access token is missing or invalid" });
    }

    jwt.verify(token, JWT_SECRET,async (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token is not valid" });
        }
        req.user = await User.scope('withoutPassword').findByPk(user.id);
        next();
    });
}