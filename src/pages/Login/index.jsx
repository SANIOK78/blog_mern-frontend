import React from "react";
// import "useDispatch()" pour envoyer sur BackEnd 'action asyncrone
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
// Dépuis le formulaire on va obtenir @mail et password
// On va utiliser la biblo reactForm ici
import { useForm } from 'react-hook-form';
import { fetchAuth, selectIsAuth } from '../../redux/slices/auth'

import styles from "./Login.module.scss";


// on va passe la requête pour ce connecter
export const Login = () => {

  // On doit comprendre si user est authentifie ou pas
  const isAuth = useSelector(selectIsAuth)

  const dispatch = useDispatch();

  // Utilisation de useForm: on récupèr les fonctions permetant
  // de valider les donnés depuis formulaire
  const { register, handleSubmit, setError, formState : {errors, isValid}} = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    // la validation va se faire seulement si les deux champs sont renseigné
    mode: 'onChange'
  });

  // Function qui va s'executer seulement si la validation c'est passé correctement
  const onSubmit = async (values) => {
    // on va dispatcher la function permetant l'autentification qui atand dans "values"
    // reçevoir "email" et "pasword"
    const data = await dispatch(fetchAuth(values))
    // si "data.payload" n'existe pas (= undefind)
    if( !data.payload) {
      return alert("Authorisation échoué !");
    }
    // si "data.payload" a une propriété "token" ça veut dire qu'on 
    // est authentifié
    if ('token' in data.payload) {
      // et on va concerver dans LocalStorage le "token"
      window.localStorage.setItem('token', data.payload.token)
    } 
  }

  // si on est authorisé, on va passé sur la page principale
  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Connectez-vous
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>

        <TextField
          className={styles.field}
          label="E-Mail"
          type="email"
          error={Boolean(errors.email?.message)}  //si true => en rouge
          helperText={errors.email?.message}
          {...register('email', { required: 'Rentrez votre mail'})}
          fullWidth
        />

        <TextField type="password"
          className={styles.field} 
          label="Password" 
          error={Boolean(errors.password?.message)}  //si true => en rouge
          helperText={errors.password?.message}
          {...register('password', { required: 'Rentrez un mot de passe'})}
          fullWidth
        />

        <Button type="submit" size="large" variant="contained" fullWidth>
          Connexion
        </Button>
      </form>
    </Paper>
  );
};
