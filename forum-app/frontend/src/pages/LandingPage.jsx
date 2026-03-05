import { Link } from 'react-router-dom';
import { ArrowRight, Code, Trophy, Users } from 'lucide-react';
import styles from './LandingPage.module.css';

const LandingPage = () => {
    return (
        <div className={styles.pageContainer}>
            {/* HERO SECTION */}
            <div className={styles.heroSection}>
                {/* Background Image / Overlay */}
                <div className={styles.heroBackground}></div>
                
                {/* Dark Vignette / Gradient overlays for contrast */}
                <div className={styles.gradientTop}></div>
                <div className={styles.gradientSide}></div>
                
                {/* Angled Accent Graphic (Like NBA 2k cutouts) */}
                <div className={styles.angledAccent}></div>

                {/* Main Content */}
                <div className={styles.heroContent}>
                    <div className={styles.heroTextContainer}>
                        <h2 className={styles.subtitle}>
                            <span className={styles.subtitleLine}></span> Code Like A Pro
                        </h2>
                        <h1 className={styles.mainTitle}>
                            FORUM 2K26<br />
                            <span className={styles.gradientText}>
                                YOUR COURT, YOUR RULES.
                            </span>
                        </h1>
                        <p className={styles.description}>
                            The definitive arena for top-tier developers. Ask questions, drop answers, and build your legacy. Are you ready to ball?
                        </p>
                        
                        <div className={styles.buttonGroup}>
                            <Link to="/questions" className={styles.btnPrimary}>
                                <span>ENTER ARENA</span>
                            </Link>
                            <Link to="/register" className={styles.btnSecondary}>
                                <span>LACE UP NOW</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* FEATURES SECTION */}
            <div className={styles.featuresSection}>
                <div className={styles.featuresHeader}>
                    <h2 className={styles.featuresTitle}>WHY PLAY <span className={styles.featuresHighlight}>HERE?</span></h2>
                </div>
                
                <div className={styles.featuresGrid}>
                    <div className={`${styles.featureCard} ${styles.cardBorderPrimary}`}>
                        <div className={`${styles.iconWrapper} ${styles.iconPrimaryBg}`}>
                            <Code size={32} className={`${styles.icon} ${styles.iconPrimary}`} />
                        </div>
                        <h3 className={styles.featureCardTitle}>Elite Solutions</h3>
                        <p className={styles.featureCardText}>Top-tier verified code snippets. Stack your stats by providing the best algorithms and fixes.</p>
                    </div>

                    <div className={`${styles.featureCard} ${styles.cardBorderAccent}`}>
                        <div className={`${styles.iconWrapper} ${styles.iconAccentBg}`}>
                            <Users size={32} className={`${styles.icon} ${styles.iconAccent}`} />
                        </div>
                        <h3 className={styles.featureCardTitle}>Pro Community</h3>
                        <p className={styles.featureCardText}>Join a squad of veteran developers. Discuss strategy, architecture, and bleeding-edge frameworks.</p>
                    </div>

                    <div className={`${styles.featureCard} ${styles.cardBorderWhite}`}>
                        <div className={`${styles.iconWrapper} ${styles.iconWhiteBg}`}>
                            <Trophy size={32} className={`${styles.icon} ${styles.iconWhite}`} />
                        </div>
                        <h3 className={styles.featureCardTitle}>Build Legacy</h3>
                        <p className={styles.featureCardText}>Climb the leaderboard with Upvotes. Your reputation precedes you on the court.</p>
                    </div>
                </div>
            </div>

            {/* CTA Banner */}
            <div className={styles.ctaBanner}>
                <div className={styles.ctaContainer}>
                    <div>
                        <h2 className={styles.ctaTitle}>DO YOU HAVE WHAT IT TAKES?</h2>
                        <p className={styles.ctaSubtitle}>Sign up in seconds and join the dev league.</p>
                    </div>
                    <Link to="/register" className={styles.ctaBtn}>
                        <span>Get Drafted <ArrowRight /></span>
                    </Link>
                </div>
                {/* Diagonal striping */}
                <div className={styles.ctaStripes}></div>
            </div>
        </div>
    );
};

export default LandingPage;
