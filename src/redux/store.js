// Création du STORE et connexion avec notre App
import { configureStore } from "@reduxjs/toolkit";

import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";


// création store
const store = configureStore({
    reducer : {
        posts: postsReducer,
        auth: authReducer
    }
});

export default store;