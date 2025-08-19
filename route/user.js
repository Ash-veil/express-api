import express from "express"
const router = express.Router()

router.post('/user', (req, res) =>{
    res.send('createUser()')
})

router.get('/user/all', (req, res) =>{
    res.send('getAllUsers()')
})

router.delete('/user/:id', (req, res) =>{
    res.send('deleteUser()')
})

router.get('/user/:id', (req, res) =>{
    res.send('getUserById()')
})

router.put('/user/:id', (req, res) =>{
    res.send('updateUser()')
})



export default router