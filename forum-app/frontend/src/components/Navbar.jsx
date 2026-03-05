import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Flame } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <Flame size={32} className={styles.logoIcon}/>
                    DEVHOOPS
                </Link>
                
                <div className={styles.navLinks}>
                    <Link to="/questions" className={styles.link}>
                        Discussions
                    </Link>
                    
                    {token ? (
                        <div className={styles.userSection}>
                            <span className={styles.userInfo}>
                                <User size={20} className={styles.userIcon}/> {user?.name}
                            </span>
                            <button onClick={handleLogout} className={styles.logoutBtn}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link to="/login" className={styles.loginBtn}>Login</Link>
                            <Link to="/register" className={styles.signupBtn}>
                                <span className={styles.signupBtnInner}>Sign Up</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
