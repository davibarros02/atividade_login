const jwt = require('jsonwebtoken');


const clearSessionAuth = (req) => {
    req.session.user = null;
    req.session.authToken = null;
};


const buildSessionUser = (decodedUser) => ({
    id: decodedUser.id,
    name: decodedUser.name,
    email: decodedUser.email,
    userType: decodedUser.userType,
    isPowerUser: decodedUser.isPowerUser
});


const getAuthenticatedSessionUser = (req) => {
    if (!req.session.user || !req.session.authToken) {
        return null;
    }

    try {
        return buildSessionUser(jwt.verify(req.session.authToken, process.env.JWT_SECRET));
    } catch (error) {
        clearSessionAuth(req);
        return null;
    }
};


module.exports = {
    clearSessionAuth,
    getAuthenticatedSessionUser
};
