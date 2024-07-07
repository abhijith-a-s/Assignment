// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './Auth/Login';
// import TestPage from './Test/testPage'
// import ResultsPage from './Result/resultPage';

// const App = () => {
//   const isLoggedIn = true; // You would typically have some authentication logic here

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={isLoggedIn ? <Navigate to="/test" /> : <LoginPage />} />
//         <Route path="/test" element={<TestPage />} />
//         <Route path="/results" element={<ResultsPage />} />
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;



import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Auth/Login';
import TestPage from './Test/testPage'
import ResultsPage from './Result/resultPage';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/test" /> : <LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/test" element={isLoggedIn ? <TestPage /> : <Navigate to="/login" />} />
        <Route path="/results" element={isLoggedIn ? <ResultsPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;

