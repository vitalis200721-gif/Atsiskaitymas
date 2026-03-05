const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Answer = require('../models/Answer');
const Question = require('../models/Question');

// GET /question/:id/answers
router.get('/question/:id/answers', async (req, res) => {
    try {
        const answers = await Answer.find({ question_id: req.params.id })
            .populate('user_id', ['name'])
            .sort({ date: -1 });
        res.json(answers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /question/:id/answers
router.post('/question/:id/answers', auth, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const newAnswer = new Answer({
            answer_text: req.body.answer_text,
            question_id: req.params.id,
            user_id: req.user.id
        });

        const answer = await newAnswer.save();
        
        // Return populated answer
        const populatedAnswer = await answer.populate('user_id', ['name']);
        res.json(populatedAnswer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /answer/:id
router.delete('/answer/:id', auth, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Check user
        if (answer.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await answer.deleteOne();
        res.json({ message: 'Answer removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Answer not found' });
        }
        res.status(500).send('Server Error');
    }
});

// POST /answer/:id/like
router.post('/answer/:id/like', auth, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Check if the answer has already been liked by this user
        const alreadyLiked = answer.likes.some(like => like.toString() === req.user.id);
        
        if (alreadyLiked) {
            // Remove the like
            answer.likes = answer.likes.filter(
                like => like.toString() !== req.user.id
            );
        } else {
            // Add like
            answer.likes.unshift(req.user.id);
            // Remove from dislike if there
            answer.dislikes = answer.dislikes.filter(
                dislike => dislike.toString() !== req.user.id
            );
        }

        await answer.save();
        res.json({ likes: answer.likes, dislikes: answer.dislikes });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /answer/:id/dislike
router.post('/answer/:id/dislike', auth, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Check if the answer has already been disliked by this user
        const alreadyDisliked = answer.dislikes.some(dislike => dislike.toString() === req.user.id);

        if (alreadyDisliked) {
            // Remove the dislike
            answer.dislikes = answer.dislikes.filter(
                dislike => dislike.toString() !== req.user.id
            );
        } else {
            // Add dislike
            answer.dislikes.unshift(req.user.id);
            // Remove from likes if there
            answer.likes = answer.likes.filter(
                like => like.toString() !== req.user.id
            );
        }

        await answer.save();
        res.json({ likes: answer.likes, dislikes: answer.dislikes });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
