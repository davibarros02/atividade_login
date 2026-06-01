const {
    getAuthenticatedSessionUser
} = require('./sessionAuth');


module.exports = (req, res, next) => {
    // Status administrativo opcional: define privilegios sem bloquear rotas publicas.
    const authenticatedUser = getAuthenticatedSessionUser(req);

    req.session.user = authenticatedUser;
    req.isAdmin = Boolean(authenticatedUser && authenticatedUser.userType === 'super');
    req.isPowerUser = Boolean(authenticatedUser && authenticatedUser.isPowerUser);
    req.canCreateAdmin = req.isPowerUser;

    next();
};
