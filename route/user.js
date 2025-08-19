import express from "express"
import User from '../model/user.js'

const router = express.Router()

router.post('/user', async (req, res) =>{
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user: "+ error.message });
    }
})

router.get('/user/all', async (req, res) =>{
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users: " + error.message });
    }
})

router.delete('/user/:id', async (req, res) =>{
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

router.get('/user/:id', async(req, res) =>{
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user: " + error.message });
    }
})

router.patch('/user/:id', async(req, res) =>{
    try {
        const userId = req.params.id;
        const [updated] = await User.update(req.body, { where: { id: userId } });
        if (updated) {
            const updatedUser = await User.findByPk(userId);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update user: " + error.message });
    }
})



export default router