import jwt from "jsonwebtoken";
import Users from "../models/all.user.model.js";

const protect = async (req, res, next) => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            if (!token) {
                throw "invalid token";
            };
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Users.findById(decoded.id);
            if (!req.user) {
                throw "user not found"
            };
            return next();
        } else {
            throw "no headers"
        }
    } catch (error) {
        if (error === "invalid token" || "no headers") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "user not found") {
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

const isChemist = (req, res, next) => {
    try {
        if (req.user.userType === "Chemist") {
            return next();
        } else {
            throw "not authorised"
        }
    } catch (error) {
        res.status(403).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

const isPatient = (req, res, next) => {
    try {
        if (req.user.userType === "Patient") {
            return next();
        } else {
            throw "not authorised"
        }
    } catch (error) {
        res.status(403).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

export {
    protect, isChemist, isPatient
};
