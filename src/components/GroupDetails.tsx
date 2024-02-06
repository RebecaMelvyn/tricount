import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { openDB } from 'idb';
import '../../src/css/GroupDetailCss.css';

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

  useEffect(() => {
    const fetchData = async () => {
      if (!groupNumber) return; 

      const db = await openDB('groupDB', 1, {
        upgrade(db) {
          const groupStore = db.createObjectStore('groups', { keyPath: 'number' });
          groupStore.createIndex('by_number', 'number');
        }
      });

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
  
  

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <h1>Détails du groupe {group.name}</h1>
        <h3>Numéro du groupe {group.number}</h3>
        <h2>Membres:</h2>
        <ul>
        {group.participants ? group.participants.map((participant, index) => (
            <li key={index}>{participant}</li>
        )) : null}
        </ul>

        <h2>Dépenses:</h2>
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>
              {expense.payer} a payé {expense.amount}€
              {expense.beneficiaries.length > 0 &&
                <span>, et {expense.beneficiaries.join(', ')} doivent rembourser {expense.amount / expense.beneficiaries.length}€ à {expense.payer}</span>
              }
            </li>
          ))}
        </ul>

        <button onClick={addExpense}>Ajouter une dépense</button>

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
