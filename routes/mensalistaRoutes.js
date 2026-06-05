const express = require('express');
const router = express.Router();
const mensalistaController = require('../controllers/mensalistaController');
const { authMiddleware, adminStatusMiddleware, authorize } = require('../middlewares/auth');

router.get('/', authMiddleware, adminStatusMiddleware, authorize(['simple']), mensalistaController.getMensalistas);
router.post('/pagamento', authMiddleware, adminStatusMiddleware, authorize(['simple']), mensalistaController.postPagamentoMensalidade);

module.exports = router;
