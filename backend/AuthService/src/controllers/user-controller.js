const {response} = require('express');
const UserService = require("../services/user-service");

const {User,Role} = require('../models/index');
const userService = new UserService();

const create = async (req,res)=>{
    try{
        const response = await userService.create({
            email:req.body.email,
            password: req.body.password
        });
        return res.status(201).json({
            success:true,
            message:'Successfully created a new user',
            data: response,
            err: {}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success : false,
            err: error
        });
    }
}

const signIn = async(req,res)=>{
    try {
        const response = await userService.signIn(req.body.email, req.body.password);
        return res.status(200).json({
            success: true,
            data: response,
            err: {},
            message: 'Successfully signed in'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success : false,
            err: error
        });
    }
}

const get = async (req,res)=>{
    try{
        const response = await userService.get(req.body.email);
        return res.status(201).json({
            success:true,
            message:'Successfully fetched a new user',
            data: response,
            err: {}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success : false,
            err: error
        });
    }
}

const admin = require('../config/firebaseAdmin'); 

const isAuthenticated = async (req, res) => {
  try {
    const token = req.headers['x-access-token'] || req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is missing',
      });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);

    return res.status(200).json({
      success: true,
      data: decodedToken,  
      message: 'User is authenticated and token is valid',
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({
      message: 'Invalid or expired token',
      success: false,
      err: error.message,
    });
  }
};


const isMentor = async (req, res) => {
    try {
        const response = await userService.isMentor(req.body.id);
        return res.status(200).json({
            data:response,
            err:{},
            success:true,
            message:'Successfully fetched whether user is mentor or not'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success: false,
            err: error
        });
    }
}

const isMentee = async (req, res) => {
    try {
        const response = await userService.isMentee(req.body.id);
        return res.status(200).json({
            data:response,
            err:{},
            success:true,
            message:'Successfully fetched whether user is mentee or not'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success: false,
            err: error
        });
    }
}

const addUserRole = async (req,res)=>{
    try {
        const u1 = await User.findByPk(req.body.userId);
        const r1 = await Role.findByPk(req.body.roleId);
        u1.addRole(r1);
        return res.status(200).json({
            err:{},
            success:true,
            message:'Successfully added user-role'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success: false,
            err: error
        });
    }
}

module.exports ={
    create,
    signIn,
    get,
    isAuthenticated,
    isMentor,
    addUserRole,
    isMentee
}