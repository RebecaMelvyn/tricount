import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateGroupForm from './components/CreateGroupForm';
import GroupDetails from './components/GroupDetails';
import GlobalProvider from './GlobalProvider'; 
import PageAccueil from './components/Accueil';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageAccueil />} />          
        <Route path="/create-group" element={<CreateGroupForm />} />
        <Route path="/group-details/:groupId" element={<GroupDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
