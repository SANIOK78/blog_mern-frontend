// Ce fichier va contenir les requête vers "back-end"

import axios from "axios";

// création d'une instance "axios"
const instance = axios.create({
    // On dit qu'on fait toujour la requete 
    // sur "localhost:4444"
    baseURL: 'http://localhost:4444'
});


// middleware qui va vérifier pour chaque requête si on a un "token"
// ou pas et si Oui alors on va l'inclure dans chaque requête envoyé 
instance.interceptors.request.use((config) => {

    // on va mettre dans le "header" de la requete le 
    // token depuis localStorage
    config.headers.Authorization = window.localStorage.getItem('token');

    return config;
})

export default instance;
