import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock } from 'lucide-react';
import axios from '../api/axios';
import styles from './Questions.module.css';

const QuestionsPage = () => {
    const [questions, setQuestions] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get('/questions');
                setQuestions(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchQuestions();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>ALL <span className={styles.highlight}>DISCUSSIONS</span></h1>
                {token && (
                    <Link to="/ask" className={styles.btnPrimary}>
                        <span>ASK QUESTION</span>
                    </Link>
                )}
            </div>

            <div className={styles.listContainer}>
                {questions.length === 0 ? (
                    <div className={styles.emptyState}>
                        No questions yet. Be the first to ask!
                    </div>
                ) : (
                    questions.map(q => {
                        const score = (q.likes?.length || 0) - (q.dislikes?.length || 0);
                        
                        return (
                            <div key={q._id} className={styles.questionCard}>
                                <div className={styles.statsColumn}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statValue}>{score}</span>
                                        <span className={styles.statLabel}>votes</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={score > 0 ? styles.statHighlight : styles.statValue}>
                                            {q.answerCount || 0}
                                        </span>
                                        <span className={styles.statLabel}>answers</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statValue}>{q.views || 0}</span>
                                        <span className={styles.statLabel}>views</span>
                                    </div>
                                </div>
                                <div className={styles.contentColumn}>
                                    <Link to={`/question/${q._id}`} className={styles.questionTitle}>
                                        {q.question_text}
                                    </Link>
                                    
                                    {q.tags && q.tags.length > 0 && (
                                        <div className={styles.tagsContainer}>
                                            {q.tags.map((tag, idx) => (
                                                <span key={idx} className={styles.tag}>{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className={styles.metaData}>
                                        <span className={styles.metaItem}><Clock size={12} /> {new Date(q.date).toLocaleString()}</span>
                                        <span className={styles.metaItem}><MessageSquare size={12} /> {q.user_id?.name || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default QuestionsPage;
