// import de mongoose dans ce fichier car on en a besoin pour créer le schèma/model
const mongoose = require('mongoose');

//Schema est une fonction mise à disposition par mongoose
const userSchema = mongoose.Schema({
  //required: true est une configuration qui indique que c'est un champs requis
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
//premier argument passé à model c'est le nom du model et le deuxième argument c'est le schéma
module.exports = mongoose.model('Users', userSchema);