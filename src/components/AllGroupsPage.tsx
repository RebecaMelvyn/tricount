// AllGroupsPage.tsx
import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface Group {
  number: string;
  name: string;
  participants: string[]; 
}

const AllGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Array<Group>>([]); 

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const db = await openDB('groupDB', 1);
        const tx = db.transaction('groups', 'readonly');
        const store = tx.objectStore('groups');
        const allGroups = await store.getAll();
        setGroups(allGroups);
        await tx.done;
      } catch (error) {
        console.error('Erreur lors de la récupération des groupes depuis IndexedDB:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleLeaveGroup = async (groupNumber: string) => {
    try {
      const db = await openDB('groupDB', 1);
      const tx = db.transaction('groups', 'readwrite');
      const store = tx.objectStore('groups');
      await store.delete(groupNumber); // Supprimer le groupe de la base de données
      await tx.done;
      
      // Mettre à jour l'état local en retirant le groupe supprimé
      setGroups(prevGroups => prevGroups.filter(group => group.number !== groupNumber));
      
      console.log(`Vous avez supprimer le groupe ${groupNumber}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du groupe depuis IndexedDB:', error);
    }
  };
  

  return (
    <div>
       <Link to="/" id='back'>
        <button>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </Link>

      <h1>Tous les groupes</h1>
      <ul>
        {groups.map(group => (
          <li key={group.number}>
            <p>Numéro: {group.number}</p>
            <p>Nom: {group.name}</p>
            <p>Participants: {group.participants.join(', ')}</p>
            <button onClick={() => handleLeaveGroup(group.number)}>Supprimer le groupe</button>
            <Link to={`/group-details/${group.number}`}>Détail du groupe</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllGroupsPage;
