'use strict'

var User = require('../models/user');
var jwt = require('../service/jwt');
var bcrypt = require('bcrypt');


function saveUser(req, res) {
    var params = req.body;
    var user = new User();
    if (params.name && params.password && params.email) {
      user.name = params.name;
      user.email = params.email;
      user.role = "ROLE_USER";
      user.image = null;
      //Control if duplicate users exist
      User.find({
        $or: [
          {
            email: user.email.toLowerCase(),
          },
        ],
      }).exec((err, users) => {
        console.log(users);
        if (err) {
          res.status(500).send({
            message: "Error en la petición",
          });
        }
        if (users && users.length >= 1) {
          return res.status(400).send({
            message: "El usuario que intenta registrar ya existe",
          });
        } else {
          //In case no duplicate users it will encrypt the password
          var sal = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(params.password, sal);
          user.password = hash;

          user
            .save()
            .then((userStored) => {
              return res.status(200).send({
                token: userStored,
              });
            })
            .catch((error) => {
              return res.status(404).send({
                message: error.message,
              });
            })
        }
      });
    } else {
      //without return if just one possible return
      res.status(200).send({
        message: "Rellena todos los campos",
      });
    }
  }

  function login(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({
      email: email
    }, (err, user) => {
      if(err) {
        return res.status(500).send({
          message: 'Error en la peticion de login'
        });
      }
      if(user) {
        console.log(user)
        bcrypt.compare(password, user.password, (err, check) => {
          if (check) {
            res.status(200).send({
              token: jwt.createToken(user)
            });
          } else {
            return res.status(404).send({
              message: 'El usuario no se ha podido identificar correctamente'
            })
          }
        })
      } else {
        return res.status(404).send({
          message: 'El usuario no se ha podido identificar.'
        })
      }
    })
  }

  function getUsers(req, res) {
    //id of the authenticated user
    //var identity_user_id = req.user.sub;
    var page = 1;
    if (req.params.page) {
      page = req.params.page;
    }
      User.find((err, users) => {
            if (err) {
              return res.status(500).send({
              message: 'Error en la petición'
              });
            }
            if (!users) {
              return res.status(404).send({
              message: 'No hay usuarios disponibles'
              });
            }
            return res.status(200).send({
              users: users
            });
          });
    }

    function getUser(req, res) {
      var id_user = req.user.sub;
      User.findById(id_user, (err, user) => {
        if(err) {
          return res.status(500).send({
            message: 'Error en la petición'
            });
        } if(!user) {
          return res.status(404).send({
            message: 'No se encontró el usuario'
            });
        }
        return res.status(200).send({
          user: user,
        });
      })
    }

    function updateUser(req, res) {
      var userId = req.user.sub;
      var update = req.body; //all the object with the information I want to update, except from pw
      //delete the pw property
      delete update.password;

      User.findByIdAndUpdate(userId, update, {
        new: true //returns the modified object, not the original without the update
      }, (error, userUpdated) => {
        if (error) {
          return res.status(500).send({
          message: 'Error en la petición'
          });
        }
        if (!userUpdated) {
          return res.status(404).send({
          message: 'No se ha podido actualizar el usuario'
          });
        }
        return res.status(200).send({
          user: userUpdated
        });
      });
    }
      
    function deleteUser(req, res) {
      var userId = req.user.sub;
      User.find({
        '_id': userId
      }).remove((err) => {
        if (err) {
          return res.status(500).send({
            message: 'Error al borrar el usuario'
          });
        }
        return res.status(200).send({
          message: 'Usuario eliminado correctamente'
        });
      })
    } 
    

//exportar la configuración
module.exports = {
    saveUser,
    login,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};