const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../config/generateToken')

const signup = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(200).json({ msg: "user exists" })
        return;
    }
    const user = await User.create({
        name,
        email,
        password,
        pic
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({ msg: "failed something wrong" });
        return;
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword((password)))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({
            msg: "invalid credentials"
        })
    }
})

const searchUser = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        }
        : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
})

module.exports = { signup, login, searchUser }