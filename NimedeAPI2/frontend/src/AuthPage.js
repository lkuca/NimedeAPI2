import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Импортируем useNavigate

const AuthPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const navigate = useNavigate();  // Инициализируем useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isRegistering
            ? 'https://localhost:7106/auth/register' // Убедитесь, что API URL правильный
            : 'https://localhost:7106/auth/login'; // Убедитесь, что API URL правильный

        const userData = {
            Username: username,
            Password: password,
        };

        try {
            const response = await axios.post(url, userData);
            console.log("Response:", response.data);

            if (isRegistering) {
                setError(''); // Очистить ошибки, если регистрация прошла успешно
                alert('Registration successful!');
            } else {
                sessionStorage.setItem('userId', username); // Сохраняем ID пользователя
                navigate('/avaleht');  // Перенаправление на страницу "Avaleht" после успешного входа
            }
        } catch (err) {
            if (err.response) {
                console.error("Server Error:", err.response.data);
                setError(err.response.data); // Ошибка от сервера
            } else {
                console.error("Network Error:", err.message);
                setError("Network or server error. Please try again.");
            }
        }
    };

    return (
        <div className="auth-page">
            <h1>{isRegistering ? 'Register' : 'Login'}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                {isRegistering && (
                    <>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                        />
                    </>
                )}
                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
                <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Already have an account? Login' : 'No account? Register'}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default AuthPage;