import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { openDB } from 'idb';
import '../../src/css/GroupDetailCss.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import de l'icône de plus
import Header from './Header';

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

const speakText = (text: string) => {
  const synth = window.speechSynthesis;
  if (synth.speaking) {
    console.error('SpeechSynthesisUtterance.speaking');
    return;
  }

  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.onend = () => {
    console.log('SpeechSynthesisUtterance.onend');
  };
  utterThis.onerror = (event) => {
    console.error('SpeechSynthesisUtterance.onerror', event);
  };

  synth.speak(utterThis);
};

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

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  const expensesPerUser: { [key: string]: number } = {};

  expenses.forEach(expense => {
    if (expense.payer in expensesPerUser) {
      expensesPerUser[expense.payer] += expense.amount;
    } else {
      expensesPerUser[expense.payer] = expense.amount;
    }

    expense.beneficiaries.forEach(beneficiary => {
      if (beneficiary in expensesPerUser) {
        expensesPerUser[beneficiary] -= expense.amount / (expense.beneficiaries.length );
      } else {
        expensesPerUser[beneficiary] = -expense.amount / (expense.beneficiaries.length );
      }
    });
  });

  const totalExpensesPerUser = Object.entries(expensesPerUser);

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

    // Lecture de la dépense ajoutée
    const expenseText = `${selectedPayer} a payé ${expense} euros pour ${reason}. ${selectedBeneficiaries.length > 0 ? selectedBeneficiaries.join(', ') + ' doivent rembourser ' + amountPerBeneficiary + ' euros chacun.' : ''}`;
    speakText(expenseText);

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
      <Header/>

      <h1>Détails du groupe {group.name}</h1>
      <h3>Numéro du groupe {group.number}</h3>
      <h2>Membres: <button type="button" onClick={showAddParticipant}>
        <FontAwesomeIcon icon={faPlus} />
      </button></h2>
      <div className="participants-card">
        <ul className="participants-list">
          {group.participants.map((participant, index) => (
            <li className='participants' key={index}>
              <div>
                {participant}
                <button type="button" className='delParticipant' onClick={() => removeParticipant(index)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div id='addParticipant'>
        <input
          type="text"
          value={newParticipantName}
          onChange={(e) => setNewParticipantName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nom du nouveau participant"
        />
      </div>
      <button id='buttonHidden' type="button" onClick={addParticipant}>
        <FontAwesomeIcon icon={faPlus} />
      </button>

      <h2>Dépenses:</h2>
      <button onClick={addExpense}>Ajouter une dépense</button>

      <ul className='lineDepense'>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.reason} : {expense.payer} a payé {expense.amount}€
            {expense.beneficiaries.length > 0 &&
              <span>, et {expense.beneficiaries.join(', ')} doivent rembourser {expense.amount / expense.beneficiaries.length}€ à {expense.payer}</span>
            }
          </li>
        ))}
      </ul>

      <h2>Total des dépenses pour tout le groupe: {totalExpenses}€</h2>

      <h2>Total des dépenses par utilisateur:</h2>
      <ul>
        {totalExpensesPerUser.map(([user, total], index) => (
          <li key={index}>{user}: {total}€</li>
        ))}
      </ul>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
            <form onSubmit={handleSubmitExpense}>
              <label id='label-popup'>
                <input placeholder='Montant'
                  type="number"
                  value={expense}
                  onChange={handleExpenseChange}
                  required
                />
              </label>
              <label id='label-popup'>
                <input placeholder='Titre'
                  type="text"
                  value={reason}
                  onChange={handleReasonChange}
                  required
                />
              </label>
              <label id='label-popup'>
                <select required value={selectedPayer} onChange={handlePayerChange}>
                  <option value="">Payer par...</option>
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
