import React, { useState, FormEvent, ChangeEvent } from 'react';
import '../../src/css/CreateGroupFormCss.css';
import Header from './Header';

const JoinGroupForm: React.FC = () => {
  const [groupCode, setGroupCode] = useState('');

  const handleGroupCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupCode(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Code du groupe:', groupCode);
  };

  return (
    <div id="container">
      <Header/>

      <form onSubmit={handleSubmit}>
        <label>
          Code du groupe
          <input
            type="text"
            value={groupCode}
            onChange={handleGroupCodeChange}
          />
        </label>

        <button type="submit">Rejoindre le groupe</button>
      </form>
    </div>
  );
};

export default JoinGroupForm;
