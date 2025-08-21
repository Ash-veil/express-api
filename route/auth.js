import express from 'express';
import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema, userSchema } from '../middleware/validation.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ;

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: login to your account
 *     description: 
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: Login successful
 *                 id:
 *                   type: integer
 *                   example: 42
 *                 username:
 *                   type: string
 *                   example: john doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 createdAt:
 *                   type: string 
 *                   example: 2023-08-31T12:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   example: 2023-08-31T12:00:00.000Z
 *                 token : 
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6CJ9.eyJpZCI6NSwiZW1haWwiOiJteS5tYWlsQG1haWwubW0iLCJ1c2VybmFtZSI6Im1hYSIsImlhdCI6MTc1NTc4Mjk5MywiZXhwIjoxNzU1Nzg2NTkzfQ.FOgFVJcVJJ64EM1k2D654tjh3nOlwCHOhQIAIE_H53I
 *       400: 
 *         description: Invalid input 
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Failed to create user
 * 
 */

router.post('/auth/login', async (req, res) => {
     const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
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

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: register a new account
 *     description: Register a new user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongPassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: Login successful
 *                 id:
 *                   type: integer
 *                   example: 42
 *                 username:
 *                   type: string
 *                   example: john doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 createdAt:
 *                   type: string 
 *                   example: 2023-08-31T12:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   example: 2023-08-31T12:00:00.000Z
 *       400: 
 *         description: Invalid input or User already exists
 *       403:
 *         description: Forbidden insufficient permission
 *       500:
 *         description: Failed to register user
 */
router.post('/auth/register', async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
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

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: terminate user session
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Failed to logout
 */
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