import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { openDB } from 'idb';
import '../../src/css/GroupDetailCss.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import de l'icône de plus


const saveExpenseToIndexedDB = async (groupNumber: string, newExpense: Expense) => {
    try {
        const db = await openDB('groupDB', 1);
        const tx = db.transaction('groups', 'readwrite');
        const store = tx.objectStore('groups');

        const group = await store.get(groupNumber);
        if (group) {
            if (!group.expenses) {
                group.expenses = [];
            }
            group.expenses.push(newExpense);
            await store.put(group); 
        }

        await tx.done;
        console.log('Dépense enregistrée avec succès dans IndexedDB.');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la dépense dans IndexedDB:', error);
    }
};

interface Group {
  number: string;
  name: string;
  participants: string[]; 
}

interface Expense {
  payer: string;
  amount: number;
  beneficiaries: string[];
  reason: string;
  description: string;
}

const GroupDetails: React.FC = () => {
  const { groupNumber } = useParams<{ groupNumber: string | undefined }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [expense, setExpense] = useState<number>(0);
  const [selectedPayer, setSelectedPayer] = useState<string | undefined>(undefined);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!groupNumber) return; 

      const db = await openDB('groupDB', 1);

      const group = await db.get('groups', groupNumber);

      if (group) {
        setGroup(group);
        setExpenses(group.expenses || []); 
      }
    };

    fetchData();
  }, [groupNumber]);

  const handleExpenseChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExpense(parseFloat(e.target.value));
  };

  const handlePayerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPayer(e.target.value);
  };

  const handleBeneficiaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSelectedBeneficiaries(prevState => {
      if (prevState.includes(value)) {
        return prevState.filter(beneficiary => beneficiary !== value);
      } else {
        return [...prevState, value];
      }
    });
  };

  const handleReasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };

  const addExpense = () => {
    setShowPopup(true);
  };

  const handleSubmitExpense = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const newExpense: Expense = {
      payer: selectedPayer!,
      amount: expense,
      beneficiaries: selectedBeneficiaries,
      reason: reason,
      description: description
    };
    const isPayerIncluded = selectedBeneficiaries.length;
    const amountPerBeneficiary = expense / isPayerIncluded;
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    await saveExpenseToIndexedDB(groupNumber!, newExpense);
    console.log('Montant à rembourser par bénéficiaire:', amountPerBeneficiary);

    setExpense(0);
    setSelectedPayer(undefined);
    setSelectedBeneficiaries([]);
    setReason('');
    setDescription('');
    setShowPopup(false);
  };
  
  
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


        <h2>Dépenses:</h2>
        <button onClick={addExpense}>Ajouter une dépense</button>

        <ul className='lineDepense'>
          {expenses.map((expense, index) => (
            <li  key={index}>
              {expense.payer} a payé {expense.amount}€
              {expense.beneficiaries.length > 0 &&
                <span>, et {expense.beneficiaries.join(', ')} doivent rembourser {expense.amount / expense.beneficiaries.length}€ à {expense.payer}</span>
              }
            </li>
          ))}
        </ul>


        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
              <form onSubmit={handleSubmitExpense}>
                <label>
                  Montant:
                  <input
                    type="number"
                    value={expense}
                    onChange={handleExpenseChange}
                  />
                </label>
                <label>
                  Titre :
                  <input
                    type="text"
                    value={reason}
                    onChange={handleReasonChange}
                  />
                </label>
                <label>
                  Payer par :
                  <select value={selectedPayer} onChange={handlePayerChange}>
                    <option value="">Choisir...</option>
                    {group.participants.map((participant, index) => (
                      <option key={index} value={participant}>{participant}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Pour qui :
                  {group.participants.map((participant, index) => (
                    <label id='members-list' key={index}>
                      <input
                        type="checkbox"
                        value={participant}
                        checked={selectedBeneficiaries.includes(participant)}
                        onChange={handleBeneficiaryChange}
                      />
                      {participant}
                    </label>
                  ))}
                </label>
                <button type="submit">Ajouter</button>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default GroupDetails;
