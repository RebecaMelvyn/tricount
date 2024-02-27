// AllGroupsPage.tsx
import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
import { Link } from 'react-router-dom';
import Header from './Header';

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
        <Header/>

      <h1>Tous les groupes</h1>
      <ul className='all_groups'>
        {groups.map(group => (
          <li className='groups' key={group.number}>
            <p className='group_name'>Groupe <b>{group.name}</b></p>
            <p>Numéro: {group.number}</p>
            <p>Participants: {group.participants.join(', ')}</p>
            <Link className='link_details' to={`/group-details/${group.number}`}>Détail du groupe</Link>
            <br />
            <br />
            <button onClick={() => handleLeaveGroup(group.number)}>Supprimer le groupe</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllGroupsPage;
