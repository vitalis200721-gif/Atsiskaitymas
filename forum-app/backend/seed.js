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
            { text: "What are the best new features in React 19?", tags: ['react', 'frontend', 'javascript'], user: u1, views: 1250, likes: [u2, u3, u4], answers: [
                { text: "The new compiler is amazing. Automatic memoization saves so much time.", user: u2, likes: [u1, u3] },
                { text: "I'm mostly excited for the new `use` hook to handle promises easily.", user: u5, likes: [u4] }
            ]},
            { text: "How do I securely store JWT tokens in a React application?", tags: ['security', 'jwt', 'auth'], user: u2, views: 890, likes: [u1, u5], answers: [
                { text: "HTTP-only cookies are generally the safest approach against XSS.", user: u3, likes: [u1, u2] }
            ]},
            { text: "What's the best way to handle global state without Redux?", tags: ['react', 'state-management'], user: u3, views: 3400, likes: [u1, u2, u4, u5], answers: [
                { text: "Zustand is incredibly lightweight and easy to use.", user: u4, likes: [u3, u5] },
                { text: "Context API + useReducer is native and works well for medium apps.", user: u1, likes: [] }
            ]},
            { text: "How to optimize Next.js App Router performance?", tags: ['nextjs', 'performance'], user: u4, views: 560, likes: [u3], answers: [] },
            { text: "Any tips for building games using Three.js?", tags: ['threejs', 'gamedev', 'javascript'], user: u5, views: 2100, likes: [u1, u2], answers: [
                { text: "Keep draw calls to a minimum and use instanced meshes where possible.", user: u1, likes: [u2, u4, u5] }
            ]},
            { text: "What is the difference between Prisma and Drizzle ORM?", tags: ['database', 'nodejs', 'orm'], user: u1, views: 430, likes: [u5], answers: [
                { text: "Prisma uses a custom schema language and Rust engine. Drizzle is purely TypeScript and SQL-like.", user: u5, likes: [u1] }
            ]},
            { text: "How to implement Server-Sent Events (SSE) in Node.js?", tags: ['nodejs', 'sse', 'backend'], user: u2, views: 320, likes: [], answers: [] },
            { text: "Best practices for writing accessible HTML in 2026?", tags: ['html', 'accessibility', 'a11y'], user: u3, views: 950, likes: [u1, u2], answers: [
                { text: "Always use semantic tags and ensure proper aria-labels when custom elements are built.", user: u4, likes: [u3] }
            ]},
            { text: "Why is my useEffect running twice in development?", tags: ['react', 'hooks'], user: u4, views: 8800, likes: [u1, u2, u3, u5], answers: [
                { text: "That is intended behavior in React StrictMode to help find side-effect bugs.", user: u1, likes: [u2, u3, u4] }
            ]},
            { text: "How does the virtual DOM actually work under the hood?", tags: ['react', 'architecture'], user: u5, views: 1100, likes: [u2, u4], answers: [] },
            { text: "Is Tailwind CSS losing popularity to CSS Modules?", tags: ['css', 'styling', 'discussion'], user: u1, views: 5040, likes: [u3, u4, u5], answers: [
                { text: "Not really, but CSS Modules provide better encapsulation for some huge enterprise projects.", user: u2, likes: [u1] },
                { text: "Both are great. It's just flavor. But CSS Modules are super solid.", user: u3, likes: [] }
            ]},
            { text: "How to handle real-time multiplayer networking in a web browser?", tags: ['websockets', 'gamedev', 'networking'], user: u2, views: 420, likes: [u5], answers: [
                { text: "Look into WebRTC for low latency peer-to-peer data channels.", user: u5, likes: [u1, u2] }
            ]},
            { text: "What are React Server Components (RSC) solving?", tags: ['react', 'server-components'], user: u3, views: 1800, likes: [u1, u2], answers: [] },
            { text: "How to properly define TypeScript interfaces for highly nested API responses?", tags: ['typescript', 'api'], user: u4, views: 670, likes: [u1], answers: [
                { text: "Use utility types like `Record` or extract nested types into their own interfaces.", user: u3, likes: [u4] }
            ]},
            { text: "Should I learn Rust for backend web development?", tags: ['rust', 'backend', 'career'], user: u5, views: 15000, likes: [u1, u2, u3, u4], answers: [
                { text: "If you need insane performance or memory safety, yes. Otherwise, Go or Node might be faster to write.", user: u1, likes: [u2, u3, u5] },
                { text: "It has a steep learning curve, but frameworks like Axum are incredible.", user: u4, likes: [u1, u5] },
                { text: "Yes, it is the future.", user: u2, likes: [] }
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
