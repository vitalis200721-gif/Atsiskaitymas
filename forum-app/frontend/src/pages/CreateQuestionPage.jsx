import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import styles from './Questions.module.css';

const CreateQuestionPage = () => {
    const [text, setText] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
            await axios.post('/question', { question_text: text, tags: tagsArray });
            navigate('/questions');
        } catch (err) {
            setError('Failed to create question.');
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.glowPrimary}></div>
            
            <h2 className={styles.pageTitle}>ASK A <span className={styles.highlight}>QUESTION</span></h2>
            {error && <div className={styles.errorBox}>{error}</div>}
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <textarea 
                    className={styles.textareaField} 
                    placeholder="What's on your mind? Be specific and clear."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    required
                ></textarea>
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Tags (comma separated)</label>
                    <input 
                        type="text" 
                        className={styles.inputField}
                        placeholder="e.g. react, bug, styling"
                        value={tagsInput}
                        onChange={e => setTagsInput(e.target.value)}
                    />
                </div>
                <div className={styles.formActions}>
                    <button type="button" onClick={() => navigate('/questions')} className={styles.btnSecondary}>CANCEL</button>
                    <button type="submit" className={styles.btnPrimary}>POST QUESTION</button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuestionPage;
