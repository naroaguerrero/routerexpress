const express = require("express");
const router = express.Router();


//-------------REGISTRO CLIENTE-------------
router.post("/registro", function (req, res) {
  let db = req.app.locals.db;
  db.collection("clientes")
    .find({ dni: req.body.dni })
    .toArray(function (err, data) {
      if (err) {
        res.send({ error: true, contenido: err });
      } else {
        if (data.length === 0) {
          req.app.locals.db
            .collection("clientes")
            .insertOne(req.body, function (err, data) {
              err
                ? res.send({ error: true, contenido: err })
                : res.send({
                    error: false,
                    contenido: {
                      respuesta: data,
                      mensaje: "Usuario registrado correctamente",
                    },
                  });
            });
        } else {
          res.send({
            error: false,
            contenido: { mensaje: "Lo sentimos, el usuario ya está registrado" },
          });
        }
      }
    });
});
//----------------------------------------

//-------------EDITAR CLIENTE-------------
router.put("/editar", function (req, res) {
  let nombre = req.body.nombre;
  let apellido = req.body.apellido;
  let dni = req.body.dni;
  req.app.locals.db
    .collection("clientes")
    .updateOne(
      { dni: dni },
      { $set: { nombre: nombre, apellido: apellido } },
      function (error, datos) {
        if (error !== null) {
          res.send({ mensaje: "Ha habido un error. " + error });
        } else {
          if (datos.matchedCount != 1) {
            if (datos.modifiedCount === 1) {
              res.send({ error: false, mensaje: "Su perfil de usuario se ha modificado correctamente" });
            } else {
              res.send({ error: false, mensaje: "No se ha podido actualizar, inténtelo de nuevo" });
            }
          } else {
            res.send({
              error: false,
              mensaje: "No se ha encontrado ningún resultado",
            });
          }
        }
      }
    );
});
//----------------------------------------

module.exports = router;
