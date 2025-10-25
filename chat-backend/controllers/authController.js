import {validatePassword} from "../models/userModel.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const generateToken = (id)=> {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});
}

export const register = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        if(!validatePassword(password)) {
            return res.status(400).json({
      message: "Password must be at least 8 chars, include uppercase, lowercase, number, and special character."
            });        
        }
        const userExists = await User.findOne({email});
        if(userExists) return res.status(400).json({message:"User Already Exists"});

        const user = await User.create({username, email, password});
        res.status(200).json({
            _id:user.id,
            username:user.username,
            email:user.email,
        });
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
};

export const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(user && await (user.matchPassword(password))) {
            res.json({
                _id:user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            return res.status(401).json({message: "Invalid email or password"});
        }
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
};