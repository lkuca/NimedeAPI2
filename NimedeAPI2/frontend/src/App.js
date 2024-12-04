import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './AuthPage';  // Путь к компоненту с авторизацией
import AvalehtPage from './avaleht'; // Путь к странице после входа

const App = () => {
    const [userId, setUserId] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/avaleht" element={<AvalehtPage />} />
            </Routes>
        </Router>
    );
};

export default App;