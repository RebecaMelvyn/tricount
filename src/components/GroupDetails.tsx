import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { openDB } from 'idb';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import de l'icône de plus
import '../../src/css/GroupeDetails.css';

interface Group {
  number: string;
  name: string;
  participants: string[]; 
}

const GroupDetails: React.FC = () => {
  const { groupNumber } = useParams<{ groupNumber: string | undefined }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [newParticipantName, setNewParticipantName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!groupNumber) return; 

      const db = await openDB('groupDB', 1);

      const group = await db.get('groups', groupNumber);

      if (group) {
        setGroup(group);
      }
    };

    fetchData();
  }, [groupNumber]);

  const removeParticipant = async (participantIndex: number) => {
    if (!group) return;

    const updatedParticipants = [...group.participants];
    updatedParticipants.splice(participantIndex, 1);

    const db = await openDB('groupDB', 1);
    await db.put('groups', { ...group, participants: updatedParticipants });

    setGroup({ ...group, participants: updatedParticipants });
  };

  const addParticipant = () => {
    if (!group || !newParticipantName) return;

    const updatedParticipants = [...group.participants, newParticipantName];
    setGroup({ ...group, participants: updatedParticipants });
    setNewParticipantName(''); // Réinitialise le champ de saisie du nom du participant après l'ajout
  };

  const showAddParticipant = () => {
    const addParticipant = document.getElementById("addParticipant");
    if (addParticipant) {
      
      addParticipant.style.display = "block";
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (event.key === 'Enter') {
      addParticipant();
      
      const buttonParticipant = document.getElementById("addParticipant");
      if (buttonParticipant) {
        buttonParticipant.style.display = "none";
      }
    }
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to="/" id='back'>
        <button>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </Link>

      <h1>Détails du groupe {group.name}</h1>
      <h3>Numéro du groupe {group.number}</h3>
      <h2>Membres:         <button type="button" onClick={showAddParticipant}>
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
      </h2>
      <ul>
        {group.participants.map((participant, index) => (
          <li className='participants' key={index}>
            {participant}
            <button type="button" className='delParticipant' onClick={() => removeParticipant(index)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </li>
        ))}
      </ul>

      <div id='addParticipant'>
        {/* Champ de saisie pour le nom du nouveau participant */}
        <input
          type="text"
          value={newParticipantName}
          onChange={(e) => setNewParticipantName(e.target.value)}
          onKeyDown={handleKeyPress} // Gestion de l'événement "onKeyDown"
          placeholder="Nom du nouveau participant"
        />
        {/* Bouton pour ajouter un participant */}
      </div>
        <button id='buttonHidden' type="button" onClick={addParticipant}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
    </div>
  );
};

export default GroupDetails;
