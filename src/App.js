// state & useEffect
import { useEffect } from "react";
//router
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

//confirm alert
import { confirmAlert } from "react-confirm-alert";

// Context
import { ContactContext } from "./context/contactContext";

// lodash
import _ from "lodash";
// Underline or Underscore

// react-toastify
import { ToastContainer, toast } from "react-toastify";

// use-immer
import { useImmer } from "use-immer";

// All component
import {
  AddContact,
  Contacts,
  EditContact,
  ViewContact,
  Navbar,
} from "./components";

// get data from contactService
import {
  createContact,
  getAllContacts,
  getAllGroups,
  deleteContact,
} from "./services/contactService";

import "./App.css";
import {
  COMMENT,
  CURRENTLINE,
  FOREGROUND,
  PURPLE,
  YELLOW,
} from "./helpers/colors";

const App = () => {
  // get all contacts from data base
  const [contacts, setContacts] = useImmer([]);

  // get all groups form data base
  const [groups, setGroups] = useImmer([]);

  // spinner gif
  const [loading, setLoading] = useImmer(false);

  // get contact from data base
  // const [contact, setContact] = useState({});

  // for search
  const [filteredContacts, setFilteredContacts] = useImmer([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: contactsData } = await getAllContacts();
        const { data: groupsData } = await getAllGroups();

        setContacts(contactsData);
        setFilteredContacts(contactsData);
        setGroups(groupsData);

        setLoading(false);
      } catch (err) {
        console.log(err.message);

        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // for submit new contact
  const createContactForm = async (values) => {
    try {
      setLoading((draft) => !draft);

      const { status, data } = await createContact(values);

      if (status === 201) {
        // toastify
        toast.success("مخاطب با موفقیت ایجاد شد", { icon: "✅" });

        //get all contacts with immer
        // draft value = contacts value
        setContacts((draft) => {
          draft.push(data);
        });

        setFilteredContacts((draft) => {
          draft.push(data);
        });

        setLoading((prevLoading) => !prevLoading);
        navigate("/contacts");
      }
    } catch (err) {
      console.log(err.message);

      setLoading((prevLoading) => !prevLoading);
    }
  };

  //UI for confirm alert
  const confirmDelete = (contactId, contactFullname) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            dir="rtl"
            style={{
              backgroundColor: CURRENTLINE,
              border: `1px solid ${PURPLE}`,
              borderRadius: "1em",
            }}
            className="p-4"
          >
            <h1 style={{ color: YELLOW }}>پاک کردن مخاطب</h1>

            <p style={{ color: FOREGROUND }}>
              مطمئن هستین که میخواهید مخاطب {contactFullname} را حذف کنید؟
            </p>

            <button
              onClick={() => {
                removeContact(contactId);
                onClose();
              }}
              className="btn mx-2"
              style={{ backgroundColor: PURPLE }}
            >
              مطمئن هستم
            </button>

            <button
              onClick={onClose}
              className="btn"
              style={{ backgroundColor: COMMENT }}
            >
              انصراف
            </button>
          </div>
        );
      },
    });
  };

  //for delete contact
  const removeContact = async (contactId) => {
    // Contacts Copy
    const contactsBackup = [...contacts];
    try {
      // filtering with immer
      setContacts((draft) => draft.filter((c) => c.id !== contactId));
      setFilteredContacts((draft) => draft.filter((c) => c.id !== contactId));

      // Sending delete request to server
      const { status } = await deleteContact(contactId);

      // react-toastify
      toast.error("مخاطب با موفقیت حذف شد", { icon: "🗑️" });

      if (status !== 200) {
        setContacts(contactsBackup);
        setFilteredContacts(contactsBackup);
      }
    } catch (err) {
      console.log(err.message);

      setContacts(contactsBackup);
      setFilteredContacts(contactsBackup);
    }
  };

  // for search
  // Debounce with lodash
  const contactSearch = _.debounce((query) => {
    // if input is empty
    if (!query) return setFilteredContacts([...contacts]);

    //immer
    setFilteredContacts((draft) =>
      draft.filter((c) =>
        c.fullname.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, 2000);

  return (
    <ContactContext.Provider
      value={{
        loading,
        setLoading,
        setContacts,
        setFilteredContacts,
        filteredContacts,
        contacts,
        groups,
        deleteContact: confirmDelete,
        createContact: createContactForm,
        contactSearch,
      }}
    >
      <div className="App">
        {/* toastify */}
        <ToastContainer rtl={true} position="top-right" theme="colored" />

        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/contacts" />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/add" element={<AddContact />} />
          <Route path="/contacts/:contactId" element={<ViewContact />} />
          <Route path="/contacts/edit/:contactId" element={<EditContact />} />
        </Routes>
      </div>
    </ContactContext.Provider>
  );
};

export default App;
