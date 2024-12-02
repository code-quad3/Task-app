require('dotenv').config();
const jwt = require('jsonwebtoken');



const jwtAuthMiddleware = (req, res, next) => {
    // Check if the token exists in cookies
    const token = req.cookies?.access_token; 
      
         
    if (!token) {
        return res.status(409).json({ error: 'Token Not Found' });
    }

    try {
        const decoded = jwt.decode(token, { complete: true });
        const currentTime = Math.floor(Date.now() / 1000);

        // Check if the token has expired
        if (decoded.payload.exp < currentTime) {
            return res.status(411).json({ error: 'Token has expired' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized access' });
            }
            req.user = decoded;
            next();
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Invalid token' });
    }
};




// Function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET,{expiresIn:"8h"});
}

module.exports = {jwtAuthMiddleware, generateToken};