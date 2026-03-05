const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// GET /questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find().populate('user_id', ['name']).sort({ date: -1 });
        
        // We also want to return the answer count for each question.
        const questionsWithCounts = await Promise.all(questions.map(async (q) => {
            const answerCount = await Answer.countDocuments({ question_id: q._id });
            return {
                ...q.toObject(),
                answerCount
            };
        }));
        
        res.json(questionsWithCounts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /question/:id
router.get('/question/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).populate('user_id', ['name']);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        // Increment view count since someone opened the details page
        question.views += 1;
        await question.save();

        res.json(question);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(500).send('Server Error');
    }
});

// POST /question
router.post('/question', auth, async (req, res) => {
    try {
        const newQuestion = new Question({
            question_text: req.body.question_text,
            user_id: req.user.id,
            tags: req.body.tags || []
        });

        const question = await newQuestion.save();
        res.json(question);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /question/:id
router.delete('/question/:id', auth, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check user
        if (question.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await question.deleteOne();
        
        // Also delete all answers related to this question
        await Answer.deleteMany({ question_id: req.params.id });

        res.json({ message: 'Question removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(500).send('Server Error');
    }
});

// POST /question/:id/like
router.post('/question/:id/like', auth, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        if (question.likes.includes(req.user.id)) {
            question.likes = question.likes.filter(userId => userId.toString() !== req.user.id);
        } else {
            question.likes.push(req.user.id);
            question.dislikes = question.dislikes.filter(userId => userId.toString() !== req.user.id);
        }

        await question.save();
        res.json({ likes: question.likes, dislikes: question.dislikes });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /question/:id/dislike
router.post('/question/:id/dislike', auth, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        if (question.dislikes.includes(req.user.id)) {
            question.dislikes = question.dislikes.filter(userId => userId.toString() !== req.user.id);
        } else {
            question.dislikes.push(req.user.id);
            question.likes = question.likes.filter(userId => userId.toString() !== req.user.id);
        }

        await question.save();
        res.json({ likes: question.likes, dislikes: question.dislikes });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
