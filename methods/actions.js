var User = require('../models/user')
var Commande = require('../models/commande')
var jwt = require('jwt-simple');
const jwt1 = require('jsonwebtoken');
var Traçe = require('../models/trace');


var config = require('../config/dbconfig')

var functions = {
    addNew: async function(req, res) {
        if (!req.body.email || !req.body.password || !req.body.nom || !req.body.numero) {
          return res.json({success: false, msg: 'Enter all fields'});
        }
      
        try {
          const newUser = new User({
            email: req.body.email,
            nom: req.body.nom,
            numero: req.body.numero,
            password: req.body.password,
          });
          await newUser.save();
          return res.json({success: true, msg: 'Successfully saved'});
        } catch (err) {
          console.error(err);
          return res.json({success: false, msg: 'Failed to save'});
        }
      },
      authenticate: function (req, res) {
        User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                res.status(403).send({success: false, msg: 'Authentication Failed, User not found'})
            } else {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        var token = jwt.encode(user, config.secret)
                        res.json({success: true, token: token})
                    } else {
                        return res.status(403).send({success: false, msg: 'Authentication failed, wrong password'})
                    }
                })
            }
        })
        .catch(err => {
            throw err;
        });
    },
    getinfo: function (req, res) {
        User.find({})
            .then(users => {
                return res.json(users);
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
            });
    },
    updateUser : async function (req, res) {
        try {
            console.log(req.body)
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(user);
          } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
          }
      },
  deleteuser : async function (req, res) {
    const id = req.params.id;

    try {
      const result = await User.findByIdAndDelete(id);
      res.status(200).send(`Utilisateur avec l'ID ${id} supprimé avec succès`);
    } catch (error) {
      console.error(error);
      res.status(500).send(`Erreur lors de la suppression de l'utilisateur avec l'ID ${id}`);
    }
  },
  addcommande: async function(req, res) {
    if (!req.body.nomproduit ||!req.body.dateestimé|| !req.body.typeprojet || !req.body.prix || !req.body.nomutilisateur) {
      return res.json({success: false, msg: 'Enter all fields'});
    }
  
    try {
      const newCommande = new Commande({
        nomproduit: req.body.nomproduit,
        dateestimé: req.body.dateestimé,
        typeprojet: req.body.typeprojet,
        prix: req.body.prix,
       nomutilisateur: req.body.nomutilisateur,
      });
      await newCommande.save();
      return res.json({success: true, msg: 'Successfully saved'});
    } catch (err) {
      console.error(err);
      return res.json({success: false, msg: 'Failed to save'});
    }
  },
  getcommande: function (req, res) {
    Commande.find({})
        .then(commandes => {
            return res.json(commandes);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
        });
},
updatecommande : async function (req, res) {
  try {
      console.log(req.body)
      const commande = await Commande.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(commande);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
},
deletecommande : async function (req, res) {
  const id = req.params.id;

  try {
    const result = await Commande.findByIdAndDelete(id);
    res.status(200).send(`commande avec l'ID ${id} supprimé avec succès`);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Erreur lors de la suppression de commande avec l'ID ${id}`);
  }
},

requireAdmin: function(req, res, next) {
  const token = req.header('Authorization');
  console.log("Received token:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt1.verify(token, 'secretKey');
    console.log("Decoded token:", decoded);

    // Add the verification code check
    const verificationCode = req.body.verificationCode;
    const verified = verifyTOTP(verificationCode, decoded.secret);

    if (!verified) {
      console.log("Access denied. Invalid verification code.");
      return res.status(401).send('Access denied. Invalid verification code.');
    }

    if (decoded.role !== 'admin') {
      console.log("Access denied. User is not an admin.");
      return res.status(403).send('Access denied. You are not an admin.');
    }
    req.user = decoded;
    next();
  } catch (ex) {
    console.log("Error:", ex);
    res.status(400).send('Bad Request');
  }
},
  verifyTOTP(code, secret) {
  const authenticator = new Authenticator();
  return authenticator.verify({
    token: code,
    secret: secret
  });
},

addtraçe: async function(req, res) {
  if (!req.body.nomproduit||!req.body.ordreservice ||!req.body.adressedetraveaux|| !req.body.nomentreprise || !req.body.numerodemarche || !req.body.augentdesuivie) {
    return res.json({success: false, msg: 'Enter all fields'});
  }

  try {
    const newTraçe = new Traçe({
     nomproduit: req.body.nomproduit,
      ordreservice: req.body.ordreservice,
      adressedetraveaux: req.body.adressedetraveaux,
      nomentreprise: req.body.nomentreprise,
      numerodemarche: req.body.numerodemarche,
     augentdesuivie: req.body.augentdesuivie,
    });
    await newTraçe.save();
    return res.json({success: true, msg: 'Successfully saved'});
  } catch (err) {
    console.error(err);
    return res.json({success: false, msg: 'Failed to save'});
  }
},
gettraçe: function (req, res) {
  Traçe.find({})
      .then(traçes => {
          return res.json(traçes);
      })
      .catch(err => {
          console.error(err);
          return res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
      });
},
updatetraçe : async function (req, res) {
  try {
      console.log(req.body)
      const traçe = await Traçe.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(traçe);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
},
deletetraçe : async function (req, res) {
  const id = req.params.id;

  try {
    const result = await Traçe.findByIdAndDelete(id);
    res.status(200).send(`commande avec l'ID ${id} supprimé avec succès`);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Erreur lors de la suppression de commande avec l'ID ${id}`);
  }
},
}



module.exports = functions;
