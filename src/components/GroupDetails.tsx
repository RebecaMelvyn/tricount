import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { openDB } from 'idb';

interface Group {
  number: string;
  name: string;
  participants: string[]; 
}

const GroupDetails: React.FC = () => {
  const { groupNumber } = useParams<{ groupNumber: string | undefined }>();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        // console.log("groupNumber:", groupNumber);

      if (!groupNumber) return; 

      const db = await openDB('groupDB', 1, {
        upgrade(db) {
          const groupStore = db.createObjectStore('groups', { keyPath: 'number' });
          groupStore.createIndex('by_number', 'number');
        }
      });

      const group = await db.get('groups', groupNumber);

    //   console.log(group.name)
    //   console.log(group.participants)
      if (group) {
        setGroup(group);
      }
    };

    fetchData();
  }, [groupNumber]);

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <h1>Détails du Groupe {group.number}</h1>
        <h2>Membres:</h2>
        <ul>
        {group.participants ? group.participants.map((participant, index) => (
            <li key={index}>{participant}</li>
        )) : null}
        </ul>


    </div>
  );
};

export default GroupDetails;
