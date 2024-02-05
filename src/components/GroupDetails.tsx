import React from 'react';
import { useParams } from 'react-router-dom';

const GroupDetails: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();


  return (
    <div>
      <h1>Détails du Groupe {groupId}</h1>
    
    </div>
  );
};

export default GroupDetails;
