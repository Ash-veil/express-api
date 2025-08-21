import express from "express"
import User from '../model/user.js'
import bcrypt from 'bcryptjs'

import { userSchema } from "../middleware/validation.js";
import { authenticateJWT } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router()
router.use(authenticateJWT);

/**
 * @openapi
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user account. Requires a valid JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
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
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         description: Invalid input 
 *       403:
 *         description: Forbidden insufficient permission
 *       500:
 *         description: Failed to create user
 */

router.post('/user',requireRole('admin'), async (req, res) =>{
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const user = await User.create(req.body);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user: "+ error.message });
    }
})

/**
 * @openapi
 * /user/all:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all registered users. Requires a valid JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     example: johndoe@example.com
 *       403:
 *         description: Forbidden insufficient permission
 *       500:
 *         description: Failed to fetch users
 */

router.get('/user/all', requireRole('admin'), async (req, res) =>{
    try {
        const users = await User.scope('withoutPassword').findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users: " + error.message });
    }
})

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by ID. Requires a valid JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete
 *         example: 42
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       403:
 *         description: Forbidden insufficient permission
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */

router.delete('/user/:id', requireRole('admin'), async (req, res) =>{
   try {
    const userId = req.params.id;
    const user = await User.destroy({where: {id : userId}});
    if (user) {
        res.status(200).json({ message: "User deleted successfully." });
    } else {
        res.status(404).json({ error: "User not found." });
    }
   } catch (error) {
    res.status(500).json({ error: "Failed to delete user: " + error.message });
   }
})

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Get a single user
 *     description: Returns details of a specific user by ID. Requires a valid JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *         example: 42
 *     responses:
 *       200:
 *         description: "User details retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 42
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-08-31T12:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-08-31T12:00:00.000Z
 *       403:
 *         description: Forbidden insufficient permission
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user
 */
router.get('/user/:id', requireRole('admin'), async(req, res) =>{
    try {
        const user = await User.scope('withoutPassword').findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user: " + error.message });
    }
})

/**
 * @openapi
 * /user/{id}:
 *   patch:
 *     summary: Update a user
 *     description: Update user details by ID. Requires a valid JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *         example: 42
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newusername
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewStrongPassword123
 *     responses:
 *       200:
 *         description: "User updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 42
 *                 username:
 *                   type: string
 *                   example: newusername
 *                 email:
 *                   type: string
 *                   example: newemail@example.com
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-08-31T12:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-08-31T13:00:00.000Z
 *       400: 
 *         description: Invalid input 
 *       403:
 *         description: Forbidden insufficient permission
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user
 */
router.patch('/user/:id', requireRole('admin'), async(req, res) =>{
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const userId = req.params.id;
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const [updated] = await User.update(req.body, { where: { id: userId } });
        if (updated) {
            const updatedUser = await User.scope('withoutPassword').findByPk(userId);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update user: " + error.message });
    }
})



export default router