import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import styles from './Auth.module.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/questions');
            window.location.reload(); // Refresh to update Navbar state
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.glowAccent}></div>
            
            <h2 className={styles.title}>REGISTER <span className={styles.dotAccent}>.</span></h2>
            {error && <div className={styles.errorBox}>{error}</div>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <input type="text" name="name" placeholder="Display Name" onChange={handleChange} required className={styles.inputField} />
                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className={styles.inputField} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className={styles.inputField} />
                <button type="submit" className={styles.submitBtnAccent}><span>CREATE ACCOUNT</span></button>
            </form>
            <p className={styles.footerText}>
                Already have an account? <Link to="/login" className={styles.footerLinkAccent}>Login</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
