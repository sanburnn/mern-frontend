import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await axios.post('http://localhost:4000/api/auth/register', { username, password });
            console.log(res);

            Swal.fire({
                icon: 'success',
                title: 'Registered successfully',
                showConfirmButton: false,
                timer: 1500
            });

            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setError('');

            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            setError('Registration failed');
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Registration failed',
                text: err.response?.data?.msg || 'An error occurred during registration',
            });
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="register-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="register-input"
                />
                <div style={{ paddingBottom: '20px', paddingTop:"20px"}}>
                    Already have an account? <Link to="/">Sign in</Link>
                </div>
                <button onClick={handleRegister} className="register-button">
                    Register
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;
