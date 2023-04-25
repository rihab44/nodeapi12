const express = require('express')
const actions = require('../methods/actions')
const passport = require('passport');

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})

//@desc Adding new user
//@route POST /adduser
router.post('/adduser', actions.addNew)

//@desc Authenticate a user
//@route POST /authenticate
router.post('/authenticate', actions.authenticate)

router.get('/getinfo', actions.getinfo)
router.post('/update/:id', actions.updateUser)
router.delete('/delete/:id', actions.deleteuser);
router.post('/addcommande',actions.addcommande);
router.get('/getcommande', actions.getcommande);
router.post('/updatecommande/:id', actions.updatecommande);
router.delete('/deletecommande/:id', actions.deletecommande);
router.post('/addtrace',actions.addtraçe);
router.get('/gettrace',actions.gettraçe);
router.post('/updatetrace/:id',actions.updatetraçe);
router.get('/admin', actions.requireAdmin); 
router.delete('/deletetrace/:id',actions.deletetraçe);
 
module.exports = router