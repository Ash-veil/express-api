import express from 'express';
import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ;


router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const { password: _, ...userData } = user.toJSON();
        const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", user: userData, token });
    } catch (error) {
        res.status(500).json({ error: "Failed to login: " + error.message });
    }
});

router.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        const { password: _, ...userData } = user.toJSON();
        const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: "User registered successfully", user: userData, token });
    } catch (error) {
        res.status(500).json({ error: "Failed to register user: " + error.message });
    }
});

router.post('/auth/logout', (req, res) => {
    try {
        //delete token on client side
        res.clearCookie('access_token'); 
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: "Failed to logout: " + error.message });
    }
});

  


export default router;