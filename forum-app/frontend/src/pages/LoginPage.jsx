import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import styles from './Auth.module.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/questions');
            window.location.reload(); // Refresh to update Navbar state
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.glowPrimary}></div>
            
            <h2 className={styles.title}>LOGIN <span className={styles.dotPrimary}>.</span></h2>
            {error && <div className={styles.errorBox}>{error}</div>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className={styles.inputField} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className={styles.inputField} />
                <button type="submit" className={styles.submitBtnPrimary}><span>SIGN IN</span></button>
            </form>
            <p className={styles.footerText}>
                Don't have an account? <Link to="/register" className={styles.footerLinkPrimary}>Register</Link>
            </p>
        </div>
    );
};

export default LoginPage;
