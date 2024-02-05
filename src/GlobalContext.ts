import { createContext } from 'react';

interface Group {
  id: string;
  name: string;
  members: string[];
}

interface GlobalContextType {
  groups: Group[];
  addGroup: (group: Group) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export default GlobalContext;
