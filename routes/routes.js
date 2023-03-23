import * as fs from "fs";
import { Router } from "express";
import {escribirArchivo, leerArchivo} from "../utils/handlers.js";
const router = Router();

//===================GET===================//

router.get('/', (req,res) => {
        res.render('home'); 
})

router.get('/contacto', (req,res) => {
    res.render('contacto'); 
})

router.get('/login', (req,res) => {
    res.render('login');
});

router.post('/app', async (req,res) => {
    let user = req.body.user;
    let pass = req.body.pass;
    const datausuarios = await leerArchivo('./data/login.json');
    const datapacientes = await leerArchivo('./data/pacientes.json');

    let arrUsuarios=datausuarios.users;
    console.log(arrUsuarios);
    let arrPacientes = datapacientes.pacientes;
    console.log(arrPacientes);
    console.log(user);
    console.log(pass);

    //arrLogin.users.forEach(element => {
    //    console.log(element);
    //});
    
    res.render('app')}); 



export default router;