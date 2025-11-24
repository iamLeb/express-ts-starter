import rateLimit from "express-rate-limit"

export const LoginLimiter =  rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
});