const fs = require("fs").promises;
const path = require("path");
const uniqId = require("uniqid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

// TODO: задокументировать каждую функцию
function listContacts() {
  fs.readFile(contactsPath)
    .then((data) => console.table(JSON.parse(data)))
    .catch((err) => console.log(err));
}

function getContactById(contactId) {
  fs.readFile(contactsPath)
    .then((data) => {
      const parsedContacts = JSON.parse(data);

      const contactToShow = parsedContacts.find(
        (contact) => contact.id == contactId
      );

      contactToShow
        ? console.table(contactToShow)
        : console.log(`Contact with ID ${contactId} not found`);
    })
    .catch((err) => console.log(err));
}

function removeContact(contactId) {
  let contacts = [];
  fs.readFile(contactsPath)
    .then((data) => {
      const parsedContacts = JSON.parse(data);

      if (!parsedContacts.find((contact) => contact.id == contactId)) {
        contacts = parsedContacts;
        return console.log(`Contact with ID ${contactId} doesn't exist`);
      }

      const newContacts = parsedContacts.filter(
        (contact) => contact.id != contactId
      );

      contacts = newContacts;

      fs.writeFile(contactsPath, JSON.stringify(contacts))
        .then(console.table(contacts))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function addContact(name, email, phone) {
  let contacts = [];

  fs.readFile(contactsPath)
    .then((data) => {
      contacts = JSON.parse(data);
      const contact = {
        id: uniqId(),
        name,
        email,
        phone,
      };

      contacts.push(contact);

      fs.writeFile(contactsPath, JSON.stringify(contacts))
        .then(console.table(contacts))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

module.exports = { listContacts, getContactById, removeContact, addContact };
