import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import axios from '../api/axios';
import styles from './QuestionDetails.module.css';

const QuestionDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [answerText, setAnswerText] = useState('');
    const [error, setError] = useState('');

    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchQuestionAndAnswers();
    }, [id]);

    const fetchQuestionAndAnswers = async () => {
        try {
            const [qRes, aRes] = await Promise.all([
                axios.get(`/question/${id}`),
                axios.get(`/question/${id}/answers`)
            ]);
            setQuestion(qRes.data);
            setAnswers(aRes.data);
        } catch (err) {
            console.error(err);
            navigate('/questions');
        }
    };

    const handleDeleteQuestion = async () => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            await axios.delete(`/question/${id}`);
            navigate('/questions');
        } catch (err) {
            console.error(err);
        }
    };

    const handlePostAnswer = async (e) => {
        e.preventDefault();
        if (!answerText.trim()) return;
        
        try {
            const res = await axios.post(`/question/${id}/answers`, { answer_text: answerText });
            setAnswers([res.data, ...answers]);
            setAnswerText('');
            setError('');
        } catch (err) {
            setError('Failed to post answer.');
        }
    };

    const handleDeleteAnswer = async (answerId) => {
        if (!window.confirm('Delete this answer?')) return;
        try {
            await axios.delete(`/answer/${answerId}`);
            setAnswers(answers.filter(a => a._id !== answerId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleLike = async (answerId) => {
        if (!token) return navigate('/login');
        try {
            const res = await axios.post(`/answer/${answerId}/like`);
            updateAnswerVotes(answerId, res.data.likes, res.data.dislikes);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDislike = async (answerId) => {
        if (!token) return navigate('/login');
        try {
            const res = await axios.post(`/answer/${answerId}/dislike`);
            updateAnswerVotes(answerId, res.data.likes, res.data.dislikes);
        } catch (err) {
            console.error(err);
        }
    };

    const handleQuestionLike = async () => {
        if (!token) return navigate('/login');
        try {
            const res = await axios.post(`/question/${id}/like`);
            setQuestion({ ...question, likes: res.data.likes, dislikes: res.data.dislikes });
        } catch (err) {
            console.error(err);
        }
    };

    const handleQuestionDislike = async () => {
        if (!token) return navigate('/login');
        try {
            const res = await axios.post(`/question/${id}/dislike`);
            setQuestion({ ...question, likes: res.data.likes, dislikes: res.data.dislikes });
        } catch (err) {
            console.error(err);
        }
    };

    const updateAnswerVotes = (answerId, likes, dislikes) => {
        setAnswers(answers.map(a => {
            if (a._id === answerId) {
                return { ...a, likes, dislikes };
            }
            return a;
        }));
    };

    if (!question) return <div style={{textAlign: 'center', marginTop: '5rem', color: 'white', fontWeight: 'bold', fontSize: '1.5rem'}}>LOADING...</div>;

    const isQuestionOwner = currentUser?.id === question.user_id?._id;
    const hasLikedQuestion = question.likes?.includes(currentUser?.id);
    const hasDislikedQuestion = question.dislikes?.includes(currentUser?.id);
    const questionScore = (question.likes?.length || 0) - (question.dislikes?.length || 0);

    return (
        <div className={styles.container}>
            {/* Question Section */}
            <div className={styles.questionSection}>
                <div className={styles.questionLayout}>
                    <div className={styles.statsColumn}>
                        <button 
                            onClick={handleQuestionLike}
                            className={hasLikedQuestion ? styles.voteBtnLiked : styles.voteBtn}
                        >
                            <ThumbsUp size={24} />
                        </button>
                        <span className={styles.scoreText}>{questionScore}</span>
                        <button 
                            onClick={handleQuestionDislike}
                            className={hasDislikedQuestion ? styles.voteBtnDisliked : styles.voteBtn}
                        >
                            <ThumbsDown size={24} />
                        </button>
                        <div className={styles.viewCount}>
                            <span className={styles.viewCountNumber}>{question.views || 0}</span>
                            <span className={styles.viewCountLabel}>views</span>
                        </div>
                    </div>

                    <div className={styles.contentColumn}>
                        <div className={styles.questionHeader}>
                            <h1 className={styles.questionTitle}>
                                {question.question_text}
                            </h1>
                            {isQuestionOwner && (
                                <button onClick={handleDeleteQuestion} className={styles.deleteBtn} title="Delete Question">
                                    <Trash2 size={24} />
                                </button>
                            )}
                        </div>
                        
                        {question.tags && question.tags.length > 0 && (
                            <div className={styles.tagsContainer}>
                                {question.tags.map((tag, idx) => (
                                    <span key={idx} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        )}
                        
                        <div className={styles.questionMeta}>
                            <div className={styles.metaInfo}>
                                <span className={styles.metaItemPrimary}><MessageSquare size={16} /> Asked by {question.user_id?.name || 'Unknown'}</span>
                                <span className={styles.metaItem}><Clock size={16} /> {new Date(question.date).toLocaleString()}</span>
                            </div>
                            <span className={styles.answerCount}>{answers.length} Answers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Answers Section */}
            <h3 className={styles.answersTitle}>ANSWERS</h3>
            <div className={styles.answersList}>
                {answers.length === 0 ? (
                    <div className={styles.noAnswers}>No answers yet.</div>
                ) : (
                    answers.map(a => {
                        const isAnswerOwner = currentUser?.id === a.user_id?._id;
                        const hasLiked = a.likes?.includes(currentUser?.id);
                        const hasDisliked = a.dislikes?.includes(currentUser?.id);

                        return (
                            <div key={a._id} className={styles.answerCard}>
                                <p className={styles.answerText}>{a.answer_text}</p>
                                
                                <div className={styles.answerFooter}>
                                    <div className={styles.voteContainer}>
                                        <button 
                                            onClick={() => handleLike(a._id)}
                                            className={hasLiked ? styles.voteBtnLiked : styles.voteBtn}
                                        >
                                            <ThumbsUp size={16} /> <span>{a.likes?.length || 0}</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDislike(a._id)}
                                            className={hasDisliked ? styles.voteBtnDisliked : styles.voteBtn}
                                        >
                                            <ThumbsDown size={16} /> <span>{a.dislikes?.length || 0}</span>
                                        </button>
                                    </div>
                                    
                                    <div className={styles.answerAuthorArea}>
                                        <div className={styles.answerAuthorInfo}>
                                            <span>By <span className={styles.authorHighlight}>{a.user_id?.name || 'Unknown'}</span></span>
                                            <span>{new Date(a.date).toLocaleDateString()}</span>
                                        </div>
                                        {isAnswerOwner && (
                                            <button onClick={() => handleDeleteAnswer(a._id)} className={styles.deleteAnswerBtn}>
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Answer Form */}
            {token ? (
                <div className={styles.postFormSection}>
                    <div className={styles.glowPrimary}></div>
                    <h3 className={styles.postFormTitle}>Your Answer</h3>
                    {error && <div className={styles.errorBox}>{error}</div>}
                    <form onSubmit={handlePostAnswer} className={styles.form}>
                        <textarea 
                            className={styles.textareaField} 
                            placeholder="Provide your solution or insight..."
                            value={answerText}
                            onChange={e => setAnswerText(e.target.value)}
                            required
                        ></textarea>
                        <div className={styles.formActions}>
                            <button type="submit" className={styles.btnPrimary}><span>POST ANSWER</span></button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className={styles.loginReqSection}>
                    <div className={styles.glowAccent}></div>
                    <p className={styles.loginReqText}>You must be logged in to answer this question.</p>
                    <button onClick={() => navigate('/login')} className={styles.btnGoLogin}><span>Go to Login</span></button>
                </div>
            )}
        </div>
    );
};

export default QuestionDetailsPage;
