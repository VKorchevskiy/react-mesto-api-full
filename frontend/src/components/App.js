import React from 'react';
import { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import { api } from '../utils/api';
import * as authApi from '../utils/authApi'
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { IsLoggedInContext } from '../contexts/IsLoggedInContext';
import { UserInfoContext } from '../contexts/UserInfoContext';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isSuccessRegisterRequest, setIsSuccessRegisterRequest] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ name: null, link: null });
  const [currentUser, setCurrentUser] = useState({});
  const [userInfo, setUserInfo] = useState({
    _id: '',
    email: '',
  });
  const [cards, setCards] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  const tokenCheck = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return;
    }

    authApi
      .getEmail(jwt)
      .then(({ data }) => {
        setUserInfo({
          ...userInfo,
          _id: data._id,
          email: data.email,
        });
        setIsLoggedIn(true);
      })
      .catch(err => console.log(err));

  };

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      history.push('/');
    }
  }, [isLoggedIn]);

  const onLogin = (data) => {
    return authApi
      .authorize(data)
      .then(({ token }) => {
        setUserInfo({ email: data.email });
        setIsLoggedIn(true);
        localStorage.setItem('jwt', token);
        setIsSuccessRegisterRequest(true);
      })
      .catch(err => {
        setIsSuccessRegisterRequest(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(err)
      });
  };

  const onRegister = (data) => {
    return authApi
      .register(data)
      .then(() => {
        history.push('/sign-in');
        setIsSuccessRegisterRequest(true);
        setIsInfoTooltipPopupOpen(true);

      })
      .catch(err => {
        setIsSuccessRegisterRequest(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(err)
      });
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  };

  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userData, cards]) => {
          setCurrentUser(userData);
          setCards(cards);
        })
        .catch(err => console.log(err));
    }
  }, [isLoggedIn]);

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ name: null, link: null });
    setIsInfoTooltipPopupOpen(false);
  }

  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleCardClick = ({ name, link }) => setSelectedCard({ name, link });

  function handleCardLike(card) {
    const isLiked = card.likes.some(like => like._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(err));
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id))
      })
      .catch(err => console.log(err));
  }

  function handleAddPlaceSubmit({ name, link }) {
    return api.setCard({ name, link })
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
  }

  function handleUpdateUser({ name, about }) {
    api.setUserInfo({ name, about })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }

  function handleUpdateAvatar({ avatar }) {
    api.setAvatar({ avatar })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <IsLoggedInContext.Provider value={isLoggedIn}>
        <UserInfoContext.Provider value={userInfo}>
          <Header onLogout={onLogout} />
          <Switch>
            <Route path="/sign-in">
              <Login onLogin={onLogin} />
            </Route>
            <Route path="/sign-up">
              <Register onRegister={onRegister} />
            </Route>
            <ProtectedRoute
              path="/"
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
              isLoggedIn={isLoggedIn}
              component={Main}
            />
          </Switch>
          <InfoTooltip isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups} isSuccess={isSuccessRegisterRequest}
            infoText={isSuccessRegisterRequest ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'} />
          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
          <ConfirmationPopup />
          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <Footer />
        </UserInfoContext.Provider>
      </IsLoggedInContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
