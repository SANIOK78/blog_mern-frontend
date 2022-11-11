// l'authorisation: 
// "createAsyncThunk" => pour passer des requêtes asynchrones
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

// action pour "connexion"
export const fetchAuth = createAsyncThunk('auth/fetchUserData', async (params) => {
    // On va envoyer vers le BD les "params": "mail" et "password" recup depuis la 
    // page de "connexion" front. BackEnd va la vérifier si user existe et va 
    // la passer a "redux" pour la sauvegarder
    // '/auth/login' = la route pour connexion dans BackEnd
    const { data } = await axios.post('/auth/login', params); 
    // si tous se passe bien on aura le "user" avec ses infos
    return data;
})

// action pour inscription utilisateur
export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {   
   
    const { data } = await axios.post('/auth/register', params);    
    return data;
})

// action pour afficher un utilisateur
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {   
    // Ici "axios" au moment de passer la requête va automatiquement récupérer le 
    // "token" depuis localStorage et va le passer avec la requête
    const { data } = await axios.get('/auth/me'); 
    // si tous se passe bien on aura le "user" avec ses infos
    return data;
})

const initialState = {
    // l'info de user stocké dans "data":
    data: null,
    // info concernat user est en 'loading'
    status: 'loading',
}

// reducer
const authSlice = createSlice({
    name: 'auth',  //nom de Slice
    initialState,
    reducers: {
        // on dit qu'on a besoin de logout, quiter l'appli
        logout: (state) => {
            state.data = null;
        }
    },
    // On va faire un sort de récupérer l'info concernant user  depuis "redux"
    // et une fois  obtenu, on va la sauvegarder dans le state    
    extraReducers: {
        // Chargement de la requête
        [fetchAuth.pending] : (state) => {
            state.status = 'loading';
            state.data = null;    //au début chargement...
        },
        // requête passé avec succes
        [fetchAuth.fulfilled] : (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;           
        },
        // requête rejeté
        [fetchAuth.rejected] : (state) => {
            state.status = 'error';
            state.data = null;
        },
        // Chargement de la requête
            [fetchAuthMe.pending] : (state) => {
            state.status = 'loading';
            state.data = null;    //au début chargement...
        },
        // requête passé avec succes
        [fetchAuthMe.fulfilled] : (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;           
        },
        // requête rejeté
        [fetchAuthMe.rejected] : (state) => {
            state.status = 'error';
            state.data = null;
        },
        // Chargement de la requête
        [fetchRegister.pending] : (state) => {
            state.status = 'loading';
            state.data = null;    //au début chargement...
        },
        // requête passé avec succes
        [fetchRegister.fulfilled] : (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;           
        },
        // requête rejeté
        [fetchRegister.rejected] : (state) => {
            state.status = 'error';
            state.data = null;
        },
    }
});

// Function permettant de dire si User est authentifié ou pas
export const selectIsAuth = (state) => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;