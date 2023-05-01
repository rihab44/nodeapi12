var User = require('../models/user')
var Commande = require('../models/commande')
var jwt = require('jwt-simple');
var Cable = require('../models/cable');
var accessoire = require('../models/accessoire');
var Product = require('../models/product');
var Traçe = require('../models/trace');


var config = require('../config/dbconfig')

var functions = {
    addNew: async function(req, res) {
        if (!req.body.email || !req.body.password || !req.body.nom || !req.body.numero || !req.body.role) {
          return res.json({success: false, msg: 'Enter all fields'});
        }
      
        try {
          const newUser = new User({
            email: req.body.email,
            nom: req.body.nom,
            numero: req.body.numero,
            password: req.body.password,
            role: req.body.role,
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
    console.log(req.body); // afficher les données envoyées avec la requête

    if (!req.body.nomproduit ||!req.body.dateestimé||!req.body.typeprojet ||!req.body.prixunitaire ||!req.body.prix ||!req.body.quantité||!req.body.nomutilisateur) {
      return res.json({success: false, msg: 'Enter all fields'});
    }
  
    try {
      const newCommande = new Commande({
        nomproduit: req.body.nomproduit,
        dateestimé: req.body.dateestimé,
        typeprojet: req.body.typeprojet,
        prixunitaire: req.body.prixunitaire,
         prix: req.body.prix,
         quantité: req.body.quantité,

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
adminMiddleware: async function(req, res, next) {
  const { email } = req.headers;
  try {
    const user = await User.findOne({ email: email }).exec();
    console.log('User:', user);
    if (user) {
      if (user.role === 'admin') {
        console.log('Cet utilisateur est un administrateur.');
        res.json({success: true});
      } else {
        console.log('Cet utilisateur n\'est pas un administrateur.');
        res.status(401).send('Unauthorized');
      }
    } else {
      console.log('Utilisateur introuvable.');
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
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
addNew: async function(req, res)  {
  console.log('nom:', req.body.nom);
  console.log('categorie:', req.body.categorie);
  console.log('prix:', req.body.prix);
  console.log('code:', req.body.code);
  console.log('stockinitial:', req.body.stockinitial);
  console.log('stocktompon:', req.body.stocktompon);

  console.log('unitedemesure:', req.body.unitedemesure);
  console.log("req")
  try {
    if ((!req.body.nom) ||(!req.body.categorie) || (!req.body.prix) || (!req.body.code) || (!req.body.stockinitial)|| (!req.body.stocktompon) || (!req.body.unitedemesure)) {
      console.log('Champs manquants');

      res.json({success: false, msg: 'Enter all fields'});
    } else {
      console.log('Tous les champs sont remplis');

      var newProduct = Product({
        nom: req.body.nom,
        categorie : req.body.categorie.toLowerCase(),
        prix: req.body.prix,
        code: req.body.code,
        stockinitial:req.body.stockinitial,
        stocktompon: req.body.stocktompon,
        unitedemesure: req.body.unitedemesure,

      });
      await newProduct.save();
   

      if (req.body.categorie.toLowerCase() === "cable") {
        var newCable = new Cable({
          nom: req.body.nom,
          categorie: req.body.categorie.toLowerCase(),
          prix: req.body.prix,
          code: req.body.code,
          stockinitial: req.body.stockinitial,
          stocktompon: req.body.stocktompon,
          unitedemesure: req.body.unitedemesure,
        });
        
        await newCable.save();
        res.status(201).send('Câble créé avec succès');
      } else {
        var newaccessoire = new accessoire({
          nom: req.body.nom,
          categorie: req.body.categorie.toLowerCase(),
          prix: req.body.prix,
          code: req.body.code,
          stockinitial: req.body.stockinitial,
          stocktompon: req.body.stocktompon,
          unitedemesure: req.body.unitedemesure,
        });
        await newaccessoire.save();
      
        res.status(201).send('Accessoire créé avec succès');
      }
     
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la création du produit');
  }
} ,     

updateProduct : async function (req, res) {
try {
    console.log(req.body)
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
},
deleteproduct : async function (req, res) {
  const id = req.params.id;

  try {
    const result = await Product.findByIdAndDelete(id);
    res.status(200).send(`produit avec l'ID ${id} supprimé avec succès`);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Erreur lors de la suppression du produit avec l'ID ${id}`);
  }
},
}



module.exports = functions;
