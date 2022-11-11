import React from "react";
import { useParams } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";

export const FullPost = () => {

  // on stock la date
  const [data, setData] = React.useState();
  // Chargement...
  const [isLoading, setLoading] = React.useState(true);

  // On indique qu'on veut avoir le "ID" du posts
  const { id } = useParams();

  // On fait une requête en locale (pas en redux) pour avoir le posts
  React.useEffect(() => {
    // on passe la requête au montage du composant
    axios.get(`/posts/${id}`)
    .then(res => {
      setData(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.warn(err);
      alert("Affichage de l'article échoué ! ")
    });

  }, []);

  // Si chargement on va returner ça:
  if(isLoading) {
    return <Post isLoading={isLoading} isFullPost />
  }

  return (
    <>
      <Post
        // Si chargement terminé, on return l'info reelle
        id={data._id}
        title={data.title}
        // Affichage de l'image qu'on recupère depuis BackEnd: On passe par un 
        // test => s'il y a un img on l'affiche sinon on affiche espace vide
        imageUrl={ data.imageUrl ? `${process.env.REACT_APP_API_URL}${data.imageUrl}` : ""}
        // imageUrl={ data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        {/* Utilisation du "react-markdown"  pour afficher le contenu 
        au format "markdown" si on en a dans l'appli */}
        {/* <p> {data.text} </p> */}
        <ReactMarkdown children={data.text} />
                
      </Post>

      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Vasea Pupkin",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Commentaire du text 555555",
          },
          {
            user: {
              fullName: "Ivan Ivanov",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
