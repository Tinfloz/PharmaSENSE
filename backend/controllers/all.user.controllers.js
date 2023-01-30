import mongoose from "mongoose";
import Users from "../models/all.user.model.js";
import Chemists from "../models/chemist.model.js";
import Patients from "../models/patient.model.js";
import { getToken } from "../utils/get.token.js";

const register = async (req, res) => {
    try {
        const { email, password, name, userType } = req.body;
        if (!email || !password || !name || !userType) {
            throw "invalid inputs"
        };
        const userExists = await Users.findOne({ email });
        if (userExists) {
            throw "user already exists"
        };
        const user = await Users.create({
            email,
            password,
            name,
            userType
        });
        if (!user) {
            throw "user could not be created"
        };
        const loginUser = userType === "Patient" ? await Patients.create({ userId: user._id }) : await Chemists.create({ userId: user._id });
        const sendUser = {
            name,
            token: getToken(user._id),
            loginUser
        };
        res.status(200).json({
            success: true,
            sendUser
        });
        return
    } catch (error) {
        if (error === "invalid inputs") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "user already exists") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        console.log(user)
        if (!user) {
            throw "user not found"
        };
        if (!await user.matchPassword(password)) {
            throw "passwords don't match"
        };
        const loginUser = user.userType === "Patient" ? await Patients.findOne({ userId: user._id }) : await Chemists.findOne({ userId: user._id });
        const sendUser = {
            name: user.name,
            token: getToken(user._id),
            loginUser
        };
        res.status(200).json({
            success: true,
            sendUser
        });
        return
    } catch (error) {
        if (error === "user not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "passwords don't match") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// set address
const setAddress = async (req, res) => {
    try {
        const patient = await Patients.findOne({ userId: req.user._id });
        const { address, longitude, latitude } = req.body;
        if (!address || !longitude || !latitude) {
            throw "fields missing";
        };
        patient.address = address;
        let location = {
            type: {
                type: "Point",
                coordinates: [longitude, latitude],
            }
        };
        patient.location = location;
        await patient.save();
        res.status(200).json({
            success: true,
            address
        });
        return
    } catch (error) {
        if (error === "fields missing") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

export {
    register,
    login,
    setAddress
}
