import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MessageSquare, Video, ExternalLink } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Top Section */}
                <div className={styles.topSection}>
                    <div className={styles.brandInfo}>
                        <h2 className={styles.logo}>DEVHOOPS <span>2K</span></h2>
                        <p className={styles.description}>
                            The premier destination for elite developers. Up your game, share your knowledge, and build your legacy on the court.
                        </p>
                    </div>

                    <div className={styles.linksGroup}>
                        <h3 className={styles.groupTitle}>Explore</h3>
                        <Link to="/questions" className={styles.link}>Discussions</Link>
                        <Link to="/login" className={styles.link}>Login</Link>
                        <Link to="/register" className={styles.link}>Get Drafted</Link>
                    </div>

                    <div className={styles.linksGroup}>
                        <h3 className={styles.groupTitle}>Legal</h3>
                        <a href="#" className={styles.link}>Terms of Service</a>
                        <a href="#" className={styles.link}>Privacy Policy</a>
                        <a href="#" className={styles.link}>Cookie Policy</a>
                    </div>
                </div>

                {/* Divider Line */}
                <div className={styles.divider}></div>

                {/* Bottom Section - Socials */}
                <div className={styles.bottomSection}>
                    <div className={styles.copyright}>
                        &copy; {new Date().getFullYear()} DEVHOOPS 2K. All rights reserved.
                    </div>
                    
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialIcon} aria-label="NBA 2K Official">
                            <span className={styles.nbaText}>NBA 2K <ExternalLink size={14} /></span>
                        </a>
                        <div className={styles.verticalDivider}></div>
                        <a href="#" className={styles.socialIcon} aria-label="Instagram">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="Facebook">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="TikTok">
                            <Video size={20} />
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="X (Twitter)">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="Discord">
                            <MessageSquare size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
