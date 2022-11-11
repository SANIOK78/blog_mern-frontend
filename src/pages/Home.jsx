import React from 'react';
// import "useDispatch()" pour envoyer sur BackEnd 'action asyncrone
import { useDispatch, useSelector } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPostes, fetchTags } from '../redux/slices/posts';

export const Home = () => {

  const dispatch = useDispatch();

  // On récupère l'info si on est authentifie ou pas
  const userData = useSelector((state) => state.auth.data);

  const { posts, tags } = useSelector(state => state.posts)

  // Avec cette condition on aura "true" ici 
  const isPostsLoading = posts.status === "loading"
  const isTagsLoading = tags.status === "loading"

  // ici on va faire les requêtes vers "backend" pour obtenir les articles
  React.useEffect(() => {
    // dispache la requête asyncrone
    dispatch(fetchPostes());
    dispatch(fetchTags());
   
  }, []);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Nouvaux" />
        <Tab label="Populaires" />
      </Tabs>

      <Grid container spacing={4}>
        <Grid xs={8} item>

          {/* S'il y a chargement  */}
          {( isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => 
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ): (  
              <Post
                id={obj._id}
                title={obj.title}
                // Affichage de l'image qu'on recupère depuis BackEnd: On va passer
                // par une condition pour ne pas planter l'application
                imageUrl={ obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ""}                
                // imageUrl={ obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""}                
                user={obj.user}              
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}

                // Ici on doit vérifier si l'ID du user connecté correspond avec
                // l'ID du l'auteur du "postage". C'est seulement l'auteur qui 
                // pourra modifier ou supprimer le "postage"
                // Si "userData" existe, on récupère son "_id" pour comparaison
                isEditable={userData?._id === obj.user._id}
              />
            ),
          )}

        </Grid>
        <Grid xs={4} item>

          <TagsBlock items={tags.items} isLoading={isTagsLoading} />

          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Vasea Pupkin',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: "C'est un commentaire pour tester l'application",
              },
              {
                user: {
                  fullName: 'Ivan Ivanov',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
