import jwt from "jsonwebtoken";
import ApplicationLevelError from "./applicationError.middleware.js";

const auth = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return next(new ApplicationLevelError("Token not found", 401));
    };

    const token = authHeader.startsWith("Bearer ")?authHeader.split(" ")[1]:authHeader;

    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = payload
        console.log("Payload JWT:", payload);
        console.log("Payload req:", req.user);
        next()
    }catch(e){
        next(new ApplicationLevelError("Unauthorized: Invalid or expired token", 401));
    }
}

export default auth;