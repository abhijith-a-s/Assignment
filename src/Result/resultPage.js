import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Result.css";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { questions } from '../question';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resultsData, setResultsData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('resultsData');
    const locationData = location.state;

    if (locationData) {
      setResultsData(locationData);
      localStorage.setItem('resultsData', JSON.stringify(locationData));
    } else if (storedData) {
      setResultsData(JSON.parse(storedData));
    } else {
      navigate('/test');
    }

    const preventGoingBack = (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/results');
    };

    window.history.pushState(null, null, '/results');
    window.addEventListener('popstate', preventGoingBack);

    return () => window.removeEventListener('popstate', preventGoingBack);
  }, [location, navigate]);

  if (!resultsData) {
    return <div>Loading...</div>;
  }

  const { answers, notes, category } = resultsData;

  const filteredQuestions = questions.filter(q => q.category === category);

  if (filteredQuestions.length === 0) {
    return <div>No questions found for this category.</div>;
  }

  const results = filteredQuestions.map((q, index) => {
    const userAnswer = answers[index];
    const correctAnswer = q.options.find(option => option.id === q.correct_option)?.value || 'Unknown'; // Handle edge case if correct answer is missing
    return {
      ...q,
      userAnswer,
      correctAnswer,
      correct: userAnswer === q.correct_option,
    };
  });

  const correctAnswers = results.filter(r => r.correct).length;
  const missedQuestions = results.filter(r => r.userAnswer === undefined).length;
  const wrongAnswers = results.length - correctAnswers - missedQuestions;
  const totalScore = (correctAnswers / results.length) * 100;

  const data = [
    { name: 'Correct', value: correctAnswers },
    { name: 'Missed', value: missedQuestions },
    { name: 'Wrong', value: wrongAnswers },
  ];

  const COLORS = ['#4caf50', '#ffeb3b', '#f44336'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="result-container">
      <h2>Results</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <h3>Score: {totalScore.toFixed(2)}%</h3>
      <div className="answers-container">
        <p>Total Correct Answers: {correctAnswers}</p>
        <p>Total Wrong Answers: {wrongAnswers}</p>
      </div>
      <h3>Notes:</h3>
      <p className="result-notes-container">{notes}</p>
    </div>
  );
};

export default ResultsPage;
