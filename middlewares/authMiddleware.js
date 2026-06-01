const {
    getAuthenticatedSessionUser
} = require('./sessionAuth');


module.exports = (req, res, next) => {
    // Autenticacao obrigatoria: sem JWT valido, a rota nao continua.
    const authenticatedUser = getAuthenticatedSessionUser(req);

    if (!authenticatedUser) {
        req.flash('error', 'Sessao expirada. Faca login novamente.');
        return res.redirect('/');
    }

    req.session.user = authenticatedUser;
    req.user = authenticatedUser;

    next();
};
