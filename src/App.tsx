import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateGroupForm from './components/CreateGroupForm';
import GroupDetails from './components/GroupDetails';
import PageAccueil from './components/Accueil';
import JoinGroupForm from './components/JoinGroup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageAccueil />} />          
        <Route path="/create-group" element={<CreateGroupForm />} />
        <Route path="/join-group" element={<JoinGroupForm />} />
        <Route path="/group-details/:groupId" element={<GroupDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
