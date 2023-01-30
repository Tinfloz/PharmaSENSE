import mongoose from "mongoose";

export const multiIdValidator = (idArray) => {
    const validArray = [];
    for (let i of idArray) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            validArray.push(false)
        } else {
            validArray.push(true)
        }
    };
    const res = validArray.some(el => el === false);
    return res;
}