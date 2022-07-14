//importation du model
const Users = require('../models/users');
//importation de bcryt (hachage MDP)
const bcrypt = require('bcrypt');
//importation token
const jwt = require('jsonwebtoken');

//fonction pour l'enregistrement des utilisateurs
exports.signup =  (req, res, next) => {
    //hachage du mot de passe
    bcrypt.hash(req.body.password, 10)
    .then( hash => {
        //création d'une nouvelle instance du modèle user avec "new Users"
        const user = new Users({
            email: req.body.email,
            password: hash
        });
        // méthode save permet d'enregistrer l'objet dans la base de donnée et retourne une promise
        user.save()
            .then(() => res.status(201).json({ message: 'Création de compte effectuée !'}))
            //error dans json est écrit sous forme de raccourci c'est la même chose que 'error: error'
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
  
//fonction pour connecter les utilisateurs existants 
exports.login = (req, res, next) => {
    Users.findOne({ email: req.body.email })
        //vérification si l'utilisateur a été trouvé
        .then(user => {
            if (user === null) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'})
            }
            //compare ce qui a été transmis par le client et ce qu'il y a dans la base de donnée
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        //assigne un token
                        token: jwt.sign(
                            { userId: user._id},
                            'RANDOM_TOKEN_SECRET_KEY',
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
};