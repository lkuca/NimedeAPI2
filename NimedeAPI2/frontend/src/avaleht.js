import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [customGender, setCustomGender] = useState('');
    const [prefix, setPrefix] = useState('');
    const [id, setId] = useState('');
    const [message, setMessage] = useState('');
    const [names, setNames] = useState([]);
    const [popularNames, setPopularNames] = useState([]);
    const [searchPrefix, setSearchPrefix] = useState(''); // State for prefix search
    const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode
    const [currentName, setCurrentName] = useState(null); // Store the current name for editing
    const [isPopularVisible, setIsPopularVisible] = useState(false); // Visibility of the Popular Names table

    // Fetch all names and popular names when the component mounts
    useEffect(() => {
        getAllNames();
        getPopularNames();
    }, []);

    const handleLogout = () => {
        // Optionally, send a request to the backend to log out the user
        axios.post('https://localhost:7106/auth/logout')  // Your logout API endpoint
            .then(response => {
                console.log(response.data); // Log response from the server (optional)
                // Clear session data (you can clear localStorage or sessionStorage based on your preference)
                sessionStorage.removeItem('userId');
                // Redirect to login or home page
                navigate('/');  // Use navigate for redirection
            })
            .catch(error => {
                console.error("Logout error:", error);
            });
    };

    const addName = async () => {
        try {
            const response = await fetch("https://localhost:7106/names/add", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    gender: gender === 'Other' ? customGender : gender, // Use custom gender if selected
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Name added successfully!');
                setName('');
                setGender('');
                setCustomGender(''); // Reset custom gender
                setPrefix('');
                getAllNames();
            } else {
                setMessage(data.message || 'Failed to add name.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const getAllNames = async () => {
        try {
            const response = await fetch("https://localhost:7106/names");
            const data = await response.json();
            if (response.ok) {
                setNames(data);
            } else {
                setMessage('Failed to fetch names.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const getPopularNames = async () => {
        try {
            const response = await fetch("https://localhost:7106/names/popular");
            const data = await response.json();
            if (response.ok) {
                setPopularNames(data);
            } else {
                setMessage('Failed to fetch popular names.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };
    const handleGenderChange = (e) => {
        const selectedGender = e.target.value;
        setGender(selectedGender);
        if (selectedGender !== 'Other') {
            setCustomGender(''); // Clear custom gender when a predefined option is selected
        }
    };

    const incrementUsage = async (id) => {
        try {
            const response = await fetch(`https://localhost:7106/names/${id}/incrementUsage`, {
                method: 'PUT',
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Usage count incremented!');
                getAllNames(); // Reload names after increment
                getPopularNames(); // Reload popular names after increment
            } else {
                setMessage('Failed to increment usage count.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const deleteName = async (id) => {
        try {
            const response = await fetch(`https://localhost:7106/names/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMessage('Name deleted successfully!');
                getAllNames(); // Reload all names after deleting
                getPopularNames(); // Reload popular names after deletion
            } else {
                setMessage('Failed to delete name.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    // Filter names by prefix in the "All Names" table
    const filteredNames = names.filter((n) =>
        n.value.toLowerCase().startsWith(searchPrefix.toLowerCase())
    );

    const handleEdit = (name) => {
        setIsEditing(true);
        setCurrentName(name); // Store current name data for editing
        setName(name.value);
        setGender(name.gender);
        setPrefix(name.prefix); // Automatically populate prefix
        setId(name.id);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`https://localhost:7106/names/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    value: name,
                    gender,
                    prefix: name.substring(0, 2).toUpperCase(),
                    usageCount: 0, // Reset usage count to 0 on update
                }),
            });

            if (response.ok) {
                setMessage('Name updated successfully!');
                setIsEditing(false);
                getAllNames();
                getPopularNames();
            } else {
                setMessage('Failed to update name.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const handleCancelUpdate = () => {
        setIsEditing(false);
        setName('');
        setGender('');
        setPrefix('');
    };

    return (
        <div className="App">
            <h1>Nimede pakkumise teenus</h1>
            <button onClick={handleLogout}>Logout</button>

            <div>
                <h2>Lisa nimi</h2>
                <input
                    type="text"
                    placeholder="Nimi"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setPrefix(e.target.value.substring(0, 2).toUpperCase());
                    }}
                />
                <select value={gender} onChange={handleGenderChange}>
                    <option value="">Vali sugu</option>
                    <option value="Mees">Mees</option>
                    <option value="Naine">Naine</option>
                    <option value="Other">Muu</option>
                </select>
                {gender === 'Other' && (
                    <input
                        type="text"
                        placeholder="Sisesta muu sugu"
                        value={customGender}
                        onChange={(e) => setCustomGender(e.target.value)}
                    />
                )}
                <button onClick={addName}>Lisa nimi</button>
            </div>

            <div>
                <h2>Otsi nimi</h2>
                <input
                    type="text"
                    placeholder="Otsi Nimi"
                    value={searchPrefix}
                    onChange={(e) => setSearchPrefix(e.target.value)}
                />
            </div>

            <div>
                <h2>Popularsed nimed</h2>
                <button onClick={() => setIsPopularVisible(!isPopularVisible)}>
                    {isPopularVisible ? "Peida Tabel" : "Näita Tabel"}
                </button>
                {isPopularVisible && (
                    <table>
                        <thead>
                            <tr>
                                <th>Nimi</th>
                                <th>Sugu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {popularNames.map((n) => (
                                <tr key={n.id}>
                                    <td>{n.value}</td>
                                    <td>{n.gender}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isEditing && (
                <div>
                    <h2>Uuenda nimi</h2>
                    <input
                        type="text"
                        placeholder="Nimi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Sugu"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    />
                    <button onClick={handleUpdate}>uuenda nimi</button>
                    <button onClick={handleCancelUpdate}>katkesta</button>
                </div>
            )}

            <div>
                <h2>Kõik nimed</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nimi</th>
                            <th>Sugu</th>
                            <th>Usage Count</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredNames.map((n) => (
                            <tr key={n.id}>
                                <td>{n.value}</td>
                                <td>{n.gender}</td>
                                <td>{n.usageCount}</td>
                                <td>
                                    <button onClick={() => handleEdit(n)}>Uenda</button>
                                    <button onClick={() => incrementUsage(n.id)}>populaarseks lisada</button>
                                    <button onClick={() => deleteName(n.id)}>kustuta</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {message && <p>{message}</p>}
        </div>
    );
}

export default App;
