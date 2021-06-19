import React, { useContext, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IsLoggedInContext } from '../contexts/IsLoggedInContext';

function Login({ onLogin }) {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const isLoggedIn = useContext(IsLoggedInContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      return;
    }

    onLogin(loginData);
  };

  return (
    <>
      {isLoggedIn && <Redirect to="/" />}
      <div className="entrance-group page__entrance-group" >
        <h2 className="entrance-group__title">Вход</h2>

        <form className={`form login__form`} onSubmit={handleSubmit}>
          <input
            className="form__input-text form__input-text_type_dark-form" type="email" name="email"
            id="email-login" placeholder="Email" required autoComplete="email"
            value={loginData.email} onChange={handleChange}
          />
          <span className="form__input-error name-profile-error"></span>
          <input
            className="form__input-text form__input-text_type_dark-form" type="password" name="password"
            id="password-login" placeholder="Пароль" required minLength="2" maxLength="200" autoComplete="password"
            value={loginData.password} onChange={handleChange}
          />
          <span className="form__input-error job-profile-error"></span>
          <input className="button form__save form__save_type_dark-form" type="submit" value="Войти" />
        </form>
      </div >
    </>
  )
}

export default Login;
