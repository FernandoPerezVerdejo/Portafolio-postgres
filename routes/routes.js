import * as fs from "fs";
import { Router } from "express";
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
})

export default router;