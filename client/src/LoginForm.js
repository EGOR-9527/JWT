import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './FormStyles.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:7000/api/login',
        formData,
        { withCredentials: true }
      );
      console.log('Вход выполнен успешно:', response.data);
      navigate('/logout'); // Перенаправляем на страницу выхода
    } catch (error) {
      console.error('Ошибка при входе в систему:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Вход в систему</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <input type="password" name="password" placeholder="Пароль" onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <button type="submit">Войти</button>
        </div>
      </form>
      <div className="link-group">
        <Link to="/logout">Выход</Link>
      </div>
    </div>
  );
};

export default LoginForm;
