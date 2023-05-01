const express = require('express')
const actions = require('../methods/actions')
const passport = require('passport');
var User = require('../models/user')

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
router.post('/admin', actions.adminMiddleware); 
router.delete('/deletetrace/:id',actions.deletetraçe);
router.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      return res.json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
  });
  router.get('/accessoire', async (req, res) => {
    try {
      const accessoires = await accessoire.find();
      return res.json(accessoires);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
  });
  router.get('/cable', async (req, res) => {
    try {
      const cables = await Cable.find();
      return res.json(cables);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des cables' });
    }
  });
  router.post('/update/:id', actions.updateProduct);
  router.delete('/delete/:id', actions.deleteproduct);
  
  
  router.post('/addproduct', actions.addNew);
  router.get('/user/:id', async function(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findById(id).exec();
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  
  
 
module.exports = router