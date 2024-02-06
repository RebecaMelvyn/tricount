import React, { useState, FormEvent, ChangeEvent } from 'react';
import '../../src/css/CreateGroupFormCss.css';
import { openDB } from 'idb';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


interface CreateGroupFormProps {
  redirectToGroupDetails: (groupNumber: string) => void;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ redirectToGroupDetails }) => {
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState<string[]>(['']);

  const handleGroupNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const handleParticipantChange = (index: number, value: string) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = value;
    setParticipants(updatedParticipants);
  };

  const addParticipant = () => {
    setParticipants([...participants, '']);
  };

  const generateUniqueGroupNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let uniqueGroupNumber = '';
    for (let i = 0; i < 8; i++) {
      uniqueGroupNumber += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return uniqueGroupNumber;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const groupNumber = generateUniqueGroupNumber(); 
    // console.log('Numéro de groupe:', groupNumber);

    // console.log('Nom du groupe:', groupName);
    // console.log('Participants:', participants);

    await saveGroupToIndexedDB(groupNumber, groupName, participants);

    redirectToGroupDetails(groupNumber);
  };

  const saveGroupToIndexedDB = async (groupNumber: string, groupName: string, participants: string[]) => {
    const db = await openDB('groupDB', 1, {
      upgrade(db) {
        db.createObjectStore('groups', { keyPath: 'number' });
      }
    });
  
    await db.transaction('groups', 'readwrite')
      .objectStore('groups')
      .put({ number: groupNumber, name: groupName, participants });
  };
  
  

  return (
    <div id="container">
      <Link to="/" id='back'>
        <button>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </Link>

      <form onSubmit={handleSubmit}>
        <label>
          Nom du groupe
          <input
            type="text"
            value={groupName}
            onChange={handleGroupNameChange}
          />
        </label>

        <label>
          Membres
          {participants.map((participant, index) => (
            <input
              key={index}
              type="text"
              value={participant}
              onChange={(e) => handleParticipantChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addParticipant}>
            +
          </button>
        </label>

        <button type="submit">Créer le groupe</button>
      </form>
    </div>
  );
};

export default CreateGroupForm;
