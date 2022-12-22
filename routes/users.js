//pour créer un routeur on a besoin d'express -> importation express
const express = require('express');
//création d'un routeur avec la méthode router()
//cela permet de faire router.post, router.get etc au lieu de app.post, app.get etc
const router = express.Router();
const userCtrl = require('../controllers/users');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/logout', userCtrl.logout);

module.exports = router;