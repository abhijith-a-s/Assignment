import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Test.css';
import { questions } from '../question';

const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = location.state || { category: 'sports' };

  const filteredQuestions = questions.filter(question => question.category === category);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState('');
  const [time, setTime] = useState(300);

  useEffect(() => {
    const preventGoingBack = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', preventGoingBack);

    return () => window.removeEventListener('popstate', preventGoingBack);
  }, []);

  const handleSubmit = useCallback(() => {
    navigate('/results', { state: { answers, notes, category } });
    window.history.replaceState(null, null, '/results');
  }, [navigate, answers, notes, category]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleSubmit]);

  const handleAnswerChange = (e) => {
    const selectedOptionId = parseInt(e.target.value, 10);
    setAnswers({ ...answers, [currentQuestion]: selectedOptionId });
  };

  const handleNext = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="test-container">
      <div className="question-container">
        <h3>{filteredQuestions[currentQuestion].question}</h3>
        {filteredQuestions[currentQuestion].options.map((option) => (
          <div key={option.id} className="option">
            <input
              type="radio"
              id={option.id} 
              value={option.id}
              checked={answers[currentQuestion] === option.id}
              onChange={handleAnswerChange}
            />
            <label htmlFor={option.id}>{option.value}</label>
          </div>
        ))}
        <button onClick={handlePrevious} disabled={currentQuestion === 0}>Previous</button>
        <button onClick={handleNext} disabled={currentQuestion === filteredQuestions.length - 1}>Next</button>
        <button onClick={handleSkip}>Skip</button>
      </div>
      <div className="notes-container">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
        />
      </div>
      <div>
        <h3>Time Remaining: {`${Math.floor(time / 60)}:${time % 60}`}</h3>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default TestPage;
