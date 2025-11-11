// server/routes/users.js
// User endpoints: list, get, update

const express = require('express');
const { listUsers, getUser, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);

module.exports = router;
