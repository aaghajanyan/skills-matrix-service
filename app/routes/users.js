const express = require('express');
const router = express.Router();

const {
    getUsers,
    getUser,
    signUp,
    updateUser,
    login,
    getCurrentUser,
} = require('../controllers/user');
const { getDashboardData } = require('../controllers/dashboardInfo');

const {
    validateAddBody,
    validateUpdateBody,
    validateLoginBody,
} = require('../validation/users');
const {
    verifyLoginToken,
    verifyRegisterToken,
    verifyRightPermission,
} = require('../validation/token');

router.get('/', verifyLoginToken, getUsers);
router.get('/current', verifyLoginToken, getCurrentUser);
router.get('/dashboard', verifyLoginToken, getDashboardData);
router.get('/:userGuid', verifyLoginToken, getUser);
router.put(
    '/:userGuid',
    verifyLoginToken,
    verifyRightPermission,
    validateUpdateBody,
    updateUser
);
router.post('/login', validateLoginBody, login);
router.post('/:token', verifyRegisterToken, validateAddBody, signUp);

module.exports = router;
