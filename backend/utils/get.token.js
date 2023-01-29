import jwt from "jsonwebtoken";

export const getToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "120d"
    });
};