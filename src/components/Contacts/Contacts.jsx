import React from "react";

import { useContext } from "react";
import { Link } from "react-router-dom";

import { ContactContext } from "../../context/contactContext";
import { Contact, Spinner } from "../index";
import { CURRENTLINE, ORANGE, PINK } from "../../helpers/colors";

const Contacts = () => {
  const { filteredContacts, loading, deleteContact } =
    useContext(ContactContext);

  return (
    <>
      <section className="container my-2">
        <div className="grid">
          <div className="row">
            <div className="col">
              <p className="h3 float-end">
                <Link
                  to={"/contacts/add"}
                  className="btn m-2"
                  style={{ backgroundColor: PINK }}
                >
                  ساخت مخاطب جدید
                  <i className="fa fa-user-plus mx-2" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* spinner */}
      {loading ? (
        <Spinner />
      ) : (
        <section className="container">
          <div className="row">
            {/* not found */}
            {filteredContacts.length > 0 ? (
              filteredContacts.map((c) => (
                <Contact
                  key={c.id}
                  deleteContact={() => deleteContact(c.id, c.fullname)}
                  contact={c}
                />
              ))
            ) : (
              <div
                className="text-center py-5"
                style={{ backgroundColor: CURRENTLINE }}
              >
                <p className="h3" style={{ color: ORANGE }}>
                  {" "}
                  مخاطب یافت نشد!{" "}
                </p>
                <img
                  src={require("../../assets/404 Page.gif")}
                  alt="not-found gif"
                  className="img-fluid w-25"
                  style={{ borderRadius: "1.5rem" }}
                />
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Contacts;
