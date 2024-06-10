import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateGroupForm from './components/CreateGroupForm';
import GroupDetails from './components/GroupDetails';
import PageAccueil from './components/Accueil';
import JoinGroupForm from './components/JoinGroup';
import AllGroupsPage from './components/AllGroupsPage';

function App() {
  const redirectToGroupDetails = (groupNumber: string) => {
    window.location.href = `/group-details/${groupNumber}`;
  };

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function (registration) {
          console.log('Service Worker registered with scope:', registration.scope);
        }).catch(function (error) {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Votre logique de soumission de formulaire ici

    // Afficher la notification push après la soumission du formulaire
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification('Form Submitted', {
          body: 'Your form has been successfully submitted!',
          icon: '/path/to/icon.png',
          badge: '/path/to/badge.png',
          data: {
            url: window.location.href,
          },
        });
      });
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageAccueil />} />
        <Route path="/groups" element={<AllGroupsPage />} />
        <Route path="/create-group" element={<CreateGroupForm redirectToGroupDetails={redirectToGroupDetails} onSubmit={handleFormSubmit} />} />
        <Route path="/join-group" element={<JoinGroupForm />} />
        <Route path="/group-details/:groupNumber" element={<GroupDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
