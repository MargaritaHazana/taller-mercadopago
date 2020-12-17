const express = require('express');
const router = express.Router();

const indexController = require("../controllers/indexController");

/* GET home page. */
router.get('/', indexController.home);

/* GET detail page */
router.get('/detail', indexController.detail);

/* GET callback page */
router.get('/callback', indexController.callback);

/* GET notificaciones page */
router.post('/notif', indexController.notif);

/* POST buy page */
router.post('/buy', indexController.buy);

module.exports = router;
