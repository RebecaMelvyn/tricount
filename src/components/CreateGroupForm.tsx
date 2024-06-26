import React, { useState, FormEvent, ChangeEvent } from 'react';
import '../../src/css/CreateGroupFormCss.css';
import { openDB } from 'idb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import de l'icône de croix
import Header from './Header';

interface CreateGroupFormProps {
  redirectToGroupDetails: (groupNumber: string) => void;
  onSubmit: (event: React.FormEvent) => void;
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

  const removeParticipant = (index: number) => {
    const updatedParticipants = [...participants];
    updatedParticipants.splice(index, 1);
    setParticipants(updatedParticipants);
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
    <div>
      <Header/>
      <div id="container">

        <form id='formCreateGroup' onSubmit={handleSubmit}>
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
              <div key={index}>
                <input
                  type="text"
                  value={participant}
                  onChange={(e) => handleParticipantChange(index, e.target.value)}
                />
                <button className='btn_delParticipant' type="button" onClick={() => removeParticipant(index)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addParticipant}>
              +
            </button>
          </label>

          <button  className='btn_submit' type="submit">Créer le groupe</button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupForm;
