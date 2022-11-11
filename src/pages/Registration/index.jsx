import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";
// On va utiliser la biblo reactForm ici
import { useForm } from 'react-hook-form';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { fetchAuth, fetchRegister, selectIsAuth } from '../../redux/slices/auth'


export const Registration = () => {

  // On doit comprendre si user est authentifie ou pas
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch();

  // Utilisation de useForm: on récupèr les fonctions permetant
  // de valider les donnés depuis formulaire
  const { register, handleSubmit, formState : {errors, isValid}} = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    },
    // la validation va se faire seulement si les champs sont renseigné
    mode: 'onChange'
  });

  // Function qui va s'executer seulement si la validation c'est passé correctement
  const onSubmit = async (values) => {
    // on va dispatcher la function permetant l'autentification qui atand dans "values"
    // reçevoir "email" et "pasword"
    const data = await dispatch(fetchRegister(values))

    // si "data.payload" n'existe pas (= undefind)
    if( !data.payload) {
      return alert("Inscription échoué !");
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
        Créer votre compte
      </Typography>
        
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        <TextField type="text" label="Nom complet" className={styles.field} 
          error={Boolean(errors.fullName?.message)}  //si true => en rouge
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Votre nom complet'})}        
          fullWidth 
        /> 

        <TextField type="email" label="E-Mail" className={styles.field}  
          error={Boolean(errors.email?.message)}  //si true => en rouge
          helperText={errors.email?.message}
          {...register('email', { required: 'Rentrez votre mail'})}          
          fullWidth
        />

        <TextField type="password" label="Password" className={styles.field} 
          error={Boolean(errors.password?.message)}  //si true => en rouge
          helperText={errors.password?.message}
          {...register('password', { required: 'Rentrez mot de passe'})}      
          fullWidth 
        />

        <Button disabled={ !isValid } type="submit" 
          size="large" variant="contained" 
          fullWidth
        >
          Inscription
        </Button>

      </form>
    </Paper>
  );
};
