import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './FormStyles.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:7000/api/registr',
        formData,
        { withCredentials: true }
      );
      console.log('Пользователь успешно зарегистрирован:', response.data);
      navigate('/login'); // Перенаправляем на страницу входа
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Регистрация пользователя</h2>
      <form onSubmit={handleRegistration}>
        <div className="input-group">
          <input type="text" name="firstname" placeholder="Имя" onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <input type="text" name="lastname" placeholder="Фамилия" onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <input type="password" name="password" placeholder="Пароль" onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <button type="submit">Зарегистрироваться</button>
        </div>
      </form>
      <div className="link-group">
        <Link to="/login">Вход</Link>
      </div>
    </div>
  );
};

export default RegistrationForm;
