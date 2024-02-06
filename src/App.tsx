import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateGroupForm from './components/CreateGroupForm';
import GroupDetails from './components/GroupDetails';
import PageAccueil from './components/Accueil';

function App() {
  const redirectToGroupDetails = (groupNumber: string) => {
    window.location.href = `/group-details/${groupNumber}`;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageAccueil />} />          
        <Route path="/create-group" element={<CreateGroupForm redirectToGroupDetails={redirectToGroupDetails} />} />
        <Route path="/group-details/:groupNumber" element={<GroupDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
