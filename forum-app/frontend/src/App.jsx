import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuestionsPage from './pages/QuestionsPage';
import QuestionDetailsPage from './pages/QuestionDetailsPage';
import CreateQuestionPage from './pages/CreateQuestionPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-4 py-8 flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/question/:id" element={<QuestionDetailsPage />} />
          <Route 
            path="/ask" 
            element={
              <ProtectedRoute>
                <CreateQuestionPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
