import { createContext } from "react";

export const ContactContext = createContext({
  loading: false,
  setLoading: () => {},
  setContacts: () => {},
  setFilteredContacts: () => {},
  filteredContacts: [],
  contacts: () => {},
  groups: [],
  deleteContact: () => {},
  createContact: () => {},
  contactSearch: () => {},
});
