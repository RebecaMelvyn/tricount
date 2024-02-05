import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageAccueil from './components/Accueil';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageAccueil />} />
      </Routes>
    </Router>
  );
}

export default App;
