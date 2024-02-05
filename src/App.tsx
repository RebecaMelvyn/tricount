import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateGroupForm from './components/CreateGroupForm';
import GroupDetails from './components/GroupDetails';
import GlobalProvider from './GlobalProvider'; 

const App = () => {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route path="/create-group" element={<CreateGroupForm />} />
          <Route path="/group-details/:groupId" element={<GroupDetails />} />
        </Routes>
      </GlobalProvider>
    </Router>
  );
};

export default App;
