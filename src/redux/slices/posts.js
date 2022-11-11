// "createAsyncThunk" => pour passer des requêtes asynchrones
import { MediationTwoTone } from "@mui/icons-material";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

// 'posts/fetchPosts' = nom de notre action
export const fetchPostes = createAsyncThunk('posts/fetchPosts', async () => {
    // on va récupérer le "Data" au moment d'execution "axios.get()"
    const { data } = await axios.get('/posts'); 
    return data;
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    // on va récupérer le "Data" au moment d'execution "axios.get()"
    const { data } = await axios.get('/tags'); 
    return data;
})

// action pour supprimer un post
export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {   
    axios.delete(`/posts/${id}`); 
})

// On va stocker les "posts", "les tags"
const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    }
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {}, //permet de mettre a jours les posts
    // On attrape trois états de notre requête
    extraReducers: {
      //Obtenir les "posts"   
        // Chargement de la requête
        [fetchPostes.pending] : (state) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        // requête passé avec succes
        [fetchPostes.fulfilled] : (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded';
        },
        // Chargement de la requête
        [fetchPostes.rejected] : (state) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },
      //Obtenir les "Tags"
        // Chargement de la requête
        [fetchTags.pending] : (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        // requête passé avec succes
        [fetchTags.fulfilled] : (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'loaded';
        },
        // Chargement de la requête
        [fetchTags.rejected] : (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },
      //Suppression du "posts"
          // Chargement de la requête
          [fetchRemovePost.pending] : (state, action) => {
            // on cherche le 'items' et on vérifie si les 'ID' corresponds
            state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
        }
    }
});

export const postsReducer = postsSlice.reducer;