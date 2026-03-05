const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Question = require('./models/Question');
const Answer = require('./models/Answer');

require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/forum_db';

const seedDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to DB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Question.deleteMany({});
        await Answer.deleteMany({});

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = await Promise.all([
            User.create({ name: 'ProDev', email: 'prodev@example.com', password: hashedPassword }),
            User.create({ name: 'CodeNinja', email: 'ninja@example.com', password: hashedPassword }),
            User.create({ name: 'TechGuru', email: 'guru@example.com', password: hashedPassword }),
            User.create({ name: 'HoopStar', email: 'hoop@example.com', password: hashedPassword }),
            User.create({ name: 'ReactMaster', email: 'react@example.com', password: hashedPassword })
        ]);

        const [u1, u2, u3, u4, u5] = users;

        // Question Data template
        const questionData = [
            { text: "What's the absolute best point guard build in NBA 2K26?", tags: ['builds', 'mycareer', 'pg'], user: u1, views: 1250, likes: [u2, u3, u4], answers: [
                { text: "Go for a 6'6 2-Way Playmaker. Max out speed and perimeter defense.", user: u2, likes: [u1, u3] },
                { text: "I prefer a smaller 6'2 sharp. The new shooting mechanics reward high 3pt rating.", user: u5, likes: [u4] }
            ]},
            { text: "How do I fix the 'Connection to Server Lost' error in the City?", tags: ['support', 'servers', 'error'], user: u2, views: 890, likes: [u1, u5], answers: [
                { text: "Try changing your DNS to 8.8.8.8 on your console. Usually helps for 2K servers.", user: u3, likes: [u1, u2] }
            ]},
            { text: "Anyone else struggling with the new shot meter?", tags: ['gameplay', 'shooting'], user: u3, views: 3400, likes: [u1, u2, u4, u5], answers: [
                { text: "Turn it off entirely! You get a boost to your green window if you shoot without the meter.", user: u4, likes: [u3, u5] },
                { text: "Yeah, it feels really delayed online compared to MyCareer.", user: u1, likes: [] }
            ]},
            { text: "Which jumpshot base is the fastest for guards this year?", tags: ['jumpshots', 'animations'], user: u4, views: 560, likes: [u3], answers: [] },
            { text: "Tips for getting defensive stopper badges fast?", tags: ['badges', 'grinding', 'defense'], user: u5, views: 2100, likes: [u1, u2], answers: [
                { text: "Play intense defense in the Rec. Good shot contests give huge badge points.", user: u1, likes: [u2, u4, u5] }
            ]},
            { text: "Is the legendary edition worth the extra VC?", tags: ['discussion', 'vc', 'purchases'], user: u1, views: 430, likes: [u5], answers: [
                { text: "Only if you plan on grinding MyTeam immediately. Otherwise, just buy the base game and save your money.", user: u5, likes: [u1] }
            ]},
            { text: "When does Season 3 officially start?", tags: ['seasons', 'news'], user: u2, views: 320, likes: [], answers: [] },
            { text: "Best dribble moves for a 6'8 SF?", tags: ['animations', 'dribbling'], user: u3, views: 950, likes: [u1, u2], answers: [
                { text: "LeBron size-up and Magic Johnson crossover. Unstoppable.", user: u4, likes: [u3] }
            ]},
            { text: "Why am I getting put at Center when my build is a Power Forward?", tags: ['rec', 'matchmaking'], user: u4, views: 8800, likes: [u1, u2, u3, u5], answers: [
                { text: "Matchmaking in the Rec prioritizes finding 5 players over perfect positions. If there's no true C, you slide down.", user: u1, likes: [u2, u3, u4] }
            ]},
            { text: "Who is the hardest historical team to beat in Domination?", tags: ['myteam', 'domination'], user: u5, views: 1100, likes: [u2, u4], answers: [] },
            { text: "Did they globally nerf steals in the latest patch?", tags: ['patch-notes', 'defense', 'gameplay'], user: u1, views: 5040, likes: [u3, u4, u5], answers: [
                { text: "Yes, interceptor badge requirements were raised and lunges drain more stamina now.", user: u2, likes: [u1] },
                { text: "Finally! Passing lane steals were way too overpowered.", user: u3, likes: [] }
            ]},
            { text: "What's the best strategy for Pro-Am 5v5 defense?", tags: ['pro-am', 'strategy'], user: u2, views: 420, likes: [u5], answers: [
                { text: "2-3 Zone is still king if you have a fast lock up top.", user: u5, likes: [u1, u2] }
            ]},
            { text: "How to effectively use the post-spin technician badge?", tags: ['badges', 'post-scoring'], user: u3, views: 1800, likes: [u1, u2], answers: [] },
            { text: "Can you transfer VC from 2K25 to 2K26?", tags: ['vc', 'support'], user: u4, views: 670, likes: [u1], answers: [
                { text: "Nope, VC has never been transferable between different years.", user: u3, likes: [u4] }
            ]},
            { text: "Looking for a squad to run 3s in the park. PS5.", tags: ['lfg', 'park', 'ps5'], user: u5, views: 15000, likes: [u1, u2, u3, u4], answers: [
                { text: "I have a 92 OVR Paint Beast, add me.", user: u1, likes: [u2, u3, u5] },
                { text: "Need a lock? Just hit elite 1.", user: u4, likes: [u1, u5] },
                { text: "Let's run tonight.", user: u2, likes: [] }
            ]}
        ];

        // Process seeding
        for (const data of questionData) {
            const questionDate = new Date();
            questionDate.setDate(questionDate.getDate() - Math.floor(Math.random() * 30)); // random date within last 30 days

            const question = await Question.create({
                question_text: data.text,
                user_id: data.user._id,
                tags: data.tags,
                views: data.views,
                likes: data.likes.map(u => u._id),
                dislikes: [],
                date: questionDate
            });

            for (const ansData of data.answers) {
                const answerDate = new Date(questionDate.getTime() + Math.random() * 86400000); // answer within a day of question
                await Answer.create({
                    answer_text: ansData.text,
                    question_id: question._id,
                    user_id: ansData.user._id,
                    likes: ansData.likes.map(u => u._id),
                    dislikes: [],
                    date: answerDate
                });
            }
        }

        console.log('Database seeded successfully with 15 questions and metadata!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
