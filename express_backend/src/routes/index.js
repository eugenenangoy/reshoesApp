const {Router} = require('express')
const user = require('../controllers/userControllers')
const auth = require("../controllers/authControllers")

const router = new Router()

router.get('/',(req,res)=>{
    res.send('Welcome to Reshoe Backend App')
})

//Routes For Authentication Controllers
router.post('/auth/user', auth.signIn)

//Routes For User Controllers
router.get('/user', auth.verifyToken, user.findAllUser)
router.post('/user', user.registerUser)
router.put('/user/:id', user.updateUser)
router.delete('/user/:id', user.deleteUser)


module.exports = router