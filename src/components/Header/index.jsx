import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
// import "Link" pour créer les liens
import { Link } from 'react-router-dom';
import { selectIsAuth, logout } from '../../redux/slices/auth'


export const Header = () => {

  const dispatch = useDispatch();

  // On doit comprendre si user est authentifié ou pas
  const isAuth = useSelector(selectIsAuth)

  // fonction permettant la déconnexion (logout)
  const onClickLogout = () => {
    if(window.confirm("Etes-vous sûr de vouloir quiter ?"))
    // On dispatch l'action "logout"
    dispatch(logout());

    // Et on supprime le contenu du localStorage
    window.localStorage.removeItem('token');
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>ARCHAKOV BLOG</div>
          </Link>

          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Ècrire un article</Button>
                </Link>

                <Button onClick={() => onClickLogout()} variant="contained" color="error">
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Connexion</Button>
                </Link>

                <Link to="/register">
                  <Button variant="contained">Créer un compte</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
