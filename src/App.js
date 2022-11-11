import React from 'react';
// import Routes
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from "@mui/material/Container";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';

// On doit comprendre si on est authentifié ou pas
function App() {

  const dispatch = useDispatch();

  // info qui fait comprendre si on est authorisé ou pas
  const isAuth = useSelector(selectIsAuth);

  // Requête au premier "render()"
  React.useEffect(() => {
    // On dispatch l'action 'fetchAuhMe'
    dispatch(fetchAuthMe());

  }, []); 

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
        
          <Route path='/' element={ <Home /> } />
          <Route path='/posts/:id' element={<FullPost />} />
          
          {/* route pour modifier un "post" */}
          <Route path='/posts/:id/edit' element={<AddPost />} />

          <Route path='/add-post' element={<AddPost />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registration />} />
  
        </Routes>
      </Container>
    </>
  );
}

export default App;
