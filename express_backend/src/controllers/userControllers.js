const {models} = require('../models/init-models')
const bcrypt = require('bcrypt')

const findAllUser = async(req, res) =>{
    try {
        const data = await models.users.findAll()
        res.status(200).send(data)
    } catch (error) {
        res.status(404).send('Data Tidak Ditemukan\n' +  error)
    }
}

const registerUser = async(req,res) => {
    const userExist = await models.users.findOne({
        where :{
            user_email : req.body.user_email
        }
    })
    const phoneNumberExist = await models.users.findOne({
        where :{
            phone_number : req.body.phone_number
        }
    })
    const salt = await bcrypt.genSalt(10);
    const passwordHashing = await bcrypt.hash(req.body.user_password, salt)
    try {
        if(userExist){
            res.send('Email Already Exist')
        }
        if(phoneNumberExist){
            res.send('Phone Number Already Exist')
        }
        else{
            await models.users.create({
                username : req.body.username,
                user_email : req.body.user_email,
                roles : req.body.roles || 1,
                phone_number : req.body.phone_number,
                user_password : passwordHashing
            })
            res.status(201).send('User Has Been Register')
        }
    } catch (error) {
        res.status(404).send(error.message)
    }
}

const updateUser = async (req, res) =>{
    const userExist = await models.users.findOne({
        where :{
            user_email : req.body.user_email
        }
    })
    const phoneNumberExist = await models.users.findOne({
        where :{
            phone_number : req.body.phone_number
        }
    })
    try {
        if(userExist){
            res.send('Email Already Exist')
        }if(phoneNumberExist){
            res.send('Phone Number Already Exist')
        }else{
            await models.users.update({
                username : req.body.username,
                user_email : req.body.user_email,
                phone_number : req.body.phone_number
            },{
                where : {
                    user_id : req.params.id
                }
            })
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const deleteUser = async(req, res) =>{
    try {
        await models.users.destroy({
            where : {
                user_id : req.params.id
            }
        })
        res.status(200).send('User Deleted')
    } catch (error) {
        res.status(400).send(error.message)        
    }
}

module.exports = {
    findAllUser,
    registerUser,
    updateUser,
    deleteUser
}