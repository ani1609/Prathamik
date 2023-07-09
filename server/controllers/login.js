const { User } = require('../models/user');
const bcrypt = require('bcrypt');

const Joi=require('joi');

async function loginController (req, res) {
    try{

        const {error}=(req.body);
        if(error)
            return res.status(400).send({message:error.details[0].message});

        const user=await User.findOne({email:req.body.email});
        if (!user)
            return res.status(401).send({message:'invalid email or password'});

        const validPassword=await bcrypt.compare(req.body.password,user.password);
        if (!validPassword)
            return res.status(401).send({message:'invalid email or password'});


        res.status(200).send({data:user, message:'Logged in successfully'});

    }catch (error){
        res.status(500).send({message:"Internal server error"});
    }
};

module.exports = loginController;