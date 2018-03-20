const router = require('express').Router();
const { validateRegister, getUrl, saveUrl, deleteUrl } = require('./controller');

router.get('/:hash', getUrl);

router.post('/', validateRegister, saveUrl);

router.delete('/:hash/:removeToken', deleteUrl);

module.exports = router;
