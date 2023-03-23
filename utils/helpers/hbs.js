import hbs from 'hbs';
import * as fs from 'fs';

hbs.registerHelper('alertalogin',(login)=>{
    console.log(login);
    let dif = tiempo2 - tiempo1;
    return alert('login exitoso');
})