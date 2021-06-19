import React, { useContext, useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { IsLoggedInContext } from '../contexts/IsLoggedInContext';
import { UserInfoContext } from '../contexts/UserInfoContext';
import logo from '../images/logo.svg';

function Header({ onLogout }) {
  const isLoggedIn = useContext(IsLoggedInContext);
  const [isShowData, setIsshowData] = useState(false);
  const { email } = useContext(UserInfoContext);

  const toogleIsShowData = (isShowData) => setIsshowData(!isShowData);


  return (
    <>
      {isLoggedIn
        ? (<div className={`header__container header__container_small-width ${isShowData ? 'header__container_active' : ''}`}>
          <p className="header__text">{email}</p>
          <button className="button header__button header__button_type_exit" onClick={onLogout}>Выйти</button>
        </div>)
        : ''
      }
      <header className="header page__header">
        <img className="logo" src={logo} alt="Логотип" />
        {isLoggedIn ? (
          <Route path="/">
            <div className="header__container header__container_big-width">
              <p className="header__text">{email}</p>
              <button className="button header__button header__button_type_exit" onClick={onLogout}>Выйти</button>
            </div>
            <button className="button header__button header__menu" onClick={() => toogleIsShowData(isShowData)}></button>
          </Route>
        ) : (
          <Switch>
            <Route path='/sign-up'>
              <Link to="sign-in" className="header__link">Войти</Link>
            </Route>
            <Route path='/sign-in'>
              <Link to="sign-up" className="header__link">Регистрация</Link>
            </Route>
            <Route path='/'>
              <Link to="sign-in" className="header__link">Войти</Link>
            </Route>
          </Switch>
        )
        }
      </header>
    </>
  )

}

export default Header;
