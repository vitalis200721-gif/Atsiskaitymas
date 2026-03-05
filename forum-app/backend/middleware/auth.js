const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        
        // Ensure user hasn't been deleted from the DB (e.g. via seed script)
        const activeUser = await User.findById(decoded.user.id);
        if (!activeUser) {
             return res.status(401).json({ message: 'User not found or deleted. Token invalid.' });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
