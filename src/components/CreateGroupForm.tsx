import React, { useState, FormEvent, ChangeEvent } from 'react';
import '../../src/css/CreateGroupFormCss.css';

const CreateGroupForm: React.FC = () => {
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('Nom du groupe:', groupName);
    console.log('Participants:', participants);
  };

  return (
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
  );
};

export default CreateGroupForm;
