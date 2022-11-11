import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
// La bibliothèque permetant d'écrire un article
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import styles from './AddPost.module.scss';

export const AddPost = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  // On doit comprendre si user est authentifie ou pas
  const isAuth = useSelector(selectIsAuth);

  // state qui va stocker la mise a jour de l'article
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  // On a besoin de "useRef()" pour pouvoir charger un image sur le Serveur
  // depuis frontEnd sur le BackEnd
  const inputFillRef = React.useRef(null);

  // On doit comprendre de manier visuelle qu'on est en mode "modification"
  const isEditing = Boolean(id);

  // Function qui va vérifier si il y a des modification dans l'input ou pas
  const handleChangeFile = async (event) => {
    try {
      // Chargement c'est fait correctement : "FormData()" = format speciale
      // permetant d'enregistrer un image côté BackEnd
      const formData = new FormData();

      // parametrage de "formData" et cet image on le récupère depuis "files[0]"
      const file = event.target.files[0];     
      formData.append('image', file)

      // On envois ce fichier sur BackEnd: le fichier se trouve dans "formData"
      // et tu me return: "data " = le URL de fichier
      const { data } = await axios.post('/upload', formData);

      // Mise a jour et stockage de fichier dans le state "imageUrl" 
      setImageUrl(data.url)

    } catch(err) {
      console.warn(err);
      alert("Erreur de chargement du fichier !")
    }
  };

  // function permettant de supprimer le fichier(image)
  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  // Méthode permettant la mise a jour de l'article une fois écrit
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  // Pour publier l'article
  const onSubmit = async () => {       
    try{
      // 1.Au début il y a chargemet de "posts" vers Serveur
      setLoading(true);

      const fields = {
        title, 
        text,
        imageUrl,
        tags       
      }
      // Au moment de l'envoit de la requête pour sauvegarder le posts sur BackEnd,
      // on va devoir preciser que si c'est une publication alors c'est une requête
      // "POST" et si c'est une "modification" alors c'est "PATCH"     
      const { data } = isEditing ? 
        await axios.patch(`/posts/${id}`, fields) : await axios.post("/posts", fields); 
      
      // Pareil pour recup de l'id
      const _id = isEditing ? id : data._id;
    
      // Si c'est une "modif", alors au moment de rédiriger l'User, on va le faire
      // depuis "id" qui figure dans URL
      // Si c'est "publication", alors la réquête nous return le nouveau "posts", on 
      // recupère dedans le "_id" et on l'envoit a l'user
      navigate(`/posts/${ _id }`) 

    } catch(err) {
      console.warn(err);
      alert("Publication d'article échoué !")
    }
  }

  // Modification "post"
  React.useEffect(() => {
    // si on récupére l'Id, on est dans la partie "modification" et  grâce a axios  
    if(id) {
      axios.get(`/posts/${id}`)
      .then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(','));
      })
      .catch(error => {
        console.warn(error);
        alert("Modification article échoué ! ")
      })
    }
  }, []);

  // Le paramétrage du composant
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Saisissez le text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );
  // si on n'a pas de 'token" ET n'est pas authorisé, on va passé sur la page principale
  if ( !window.localStorage.getItem('token') && !isAuth ) {
    return <Navigate to="/" />
  }

  return (
    <Paper style={{ padding: 30 }}>

      {/* Bouton permettant de charger un image. On va dire qu'en cliquant dessus 
      on fait referance a l'input  pour charger le "file" */}
      <Button onClick={ () => inputFillRef.current.click() }
        variant="outlined" size="large"
      > Chargement aperçu </Button>
        
      {/* Input caché, permettant de charger un image */}
      <input ref={inputFillRef} type="file" onChange={handleChangeFile} hidden />

      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Supprimer
          </Button>

          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
     
      <br /><br /> 

      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Titre article"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />

      <TextField 
        classes={{ root: styles.tags }} 
        variant="standard" 
        placeholder="Tags" 
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth 
      />
      
      {/* Utilisation de la bibliothèque "SimpleMDE" */}
      <SimpleMDE className={styles.editor} value={text} 
        onChange={onChange} options={options} 

      />

      <div className={styles.buttons}>
        
        {/* Bouton pour soumettre le formulaire */}
        <Button onClick={onSubmit} size="large" variant="contained">

          {/* Utilisation du Boolean "isEditing" */}
          {isEditing ? 'Modifier' : 'Publier'}
          
        </Button>

        <Link to="/">
          <Button size="large">Annuler</Button>
        </Link>

      </div>
    </Paper>
  );
};
