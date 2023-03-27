import * as fs from "fs";
import { Router } from "express";
import { escribirArchivo, leerArchivo ,alertaSI } from "../utils/handlers.js";
import { send } from "process";
import { time, timeEnd } from "console";
import { Script } from "vm";
const router = Router();

//===================GET===================//

router.get('/', (req, res) => {
    res.render('home');
})

router.get('/contacto', (req, res) => {
    res.render('contacto');
})

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/app', async (req, res) => {
    let user = req.body.user;
    let pass = req.body.pass;
    const datausuarios = await leerArchivo('./data/login.json');
    const datapacientes = await leerArchivo('./data/pacientes.json');

    let arrUsuarios = datausuarios.users;
    console.log(arrUsuarios);
    let arrPacientes = datapacientes.pacientes;
    console.log(arrPacientes);
    console.log(user);
    console.log(pass);
    let llave = false;
    arrUsuarios.forEach(element => {
        if (user == element.nombre && pass == element.contrasena) {
            console.log(element.nombre);
            console.log(element.contrasena);
            llave = true;
        }
    });
    if (llave == true) {
            res.send("<Script>alert('Login exitoso')</Script>" .render("home"))
    }
    else {
        res.render("login2")
    }       
});
export default router;