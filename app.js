//importation de Express en créant une const express
const express = require('express');
//contiendra l'application, on appel la méthode express() ce qui permettra de créer une application express
const app = express();
//importation du model
const Users = require('./models/users');
//importation de bcryt (hachage MDP)
const bcrypt = require('bcrypt');

//import de mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://lepape:1234@cluster0.p3uhk.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
/*Permet d'accéder au corps de la requête
ce middleware intercepte toute les requêtes qui on un contenu de type JSON
et met à disposition ce contenu (ou corps de la requête) sur l'objet requête dans req.body
une méthode plus ancienne permet de faire la même chose (bodyParser)*/
app.use(express.json());

/*ce middleware permet d'ajouter un header (setHeader) au objet (ces header palie au problème de CORS)
c'est un middleware générale c'est-à-dire qu'on ajoute pas de route spécifique
*/
app.use((req, res, next) => {
    //'Access-Control-Allow-Origin' = origine, '*' = tout le monde
    //origine qui a le droit d'accéder à l'API c'est tout le monde
    res.setHeader('Access-Control-Allow-Origin', '*');
    //autorisation d'utiliser certains Headers sur l'objet requête
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //autorisation d'utiliser certaines méthodes (verbes de requête)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//route pour création de compte
app.post('/api/auth/signup', (req, res, next) => {
  //hachage du mot de passe avant de sauvegarder
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  //création d'une nouvelle instance du modèle user avec "new Users"
  const user = new Users({
      //"..." est un racourci en JS permet de copier les champs du body de la requête
      ...req.body
  });
  // méthode save permet d'enregistrer l'objet dans la base de donnée et retourne une promise
  user.save()
  .then(() => res.status(201).json({ message: 'Création de compte effectuée !'}))
  //error dans json est écrit sous forme de raccourci c'est la même chose que 'error: error'
  .catch(error => res.status(400).json({ error }));
});

//route pour connexion
app.post('/api/auth/login', (req, res, next) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  Users.findOne({ ...req.body })
      .then(user => res.status(200).json(user))
      .catch(error => res.status(404).json({ error }));
});

//permet d'exporter l'application/constante pour qu'elle soit accessible depuis les autres fichiers (notamment le serveur node)
module.exports = app;