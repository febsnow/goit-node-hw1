const fs = require('fs').promises;
const path = require('path');
const uniqId = require('uniqid');

const contactsPath = path.join(__dirname, './db/contacts.json');

function write_n_showContacts(data) {
  fs.writeFile(contactsPath, JSON.stringify(data, null, '\t'))
    .then(console.table(data))
    .catch((err) => console.log(err));
}

// TODO: задокументировать каждую функцию
async function getContactsList() {
  try {
    const contacts = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(contacts);
    return parsedContacts;
  } catch (error) {
    console.log(error);
  }
}

async function showContactsList() {
  try {
    const contacts = await getContactsList();
    console.table(contacts);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await getContactsList();
    const contactToShow = contacts.find((contact) => contact.id == contactId);
    contactToShow
      ? console.table(contactToShow)
      : console.log(`Contact with ID ${contactId} not found`);
  } catch (error) {
    console.log(error);
  }
}

// function getContactById(contactId) {
//   fs.readFile(contactsPath)
//     .then((data) => {
//       const parsedContacts = JSON.parse(data);

//       const contactToShow = parsedContacts.find(
//         (contact) => contact.id == contactId
//       );

//       contactToShow
//         ? console.table(contactToShow)
//         : console.log(`Contact with ID ${contactId} not found`);
//     })
//     .catch((err) => console.log(err));
// }

async function removeContact(contactId) {
  let contacts = [];
  try {
    const contactsList = await getContactsList();

    if (!contactsList.find((contact) => contact.id == contactId)) {
      return console.log(`Contact with ID ${contactId} doesn't exist`);
    }

    const newContacts = contactsList.filter(
      (contact) => contact.id != contactId
    );

    contacts = newContacts;

    write_n_showContacts(contacts);
  } catch (error) {
    console.log(error);
  }
}

// function removeContact(contactId) {
//   let contacts = [];
//   fs.readFile(contactsPath)
//     .then((data) => {
//       const parsedContacts = JSON.parse(data);

//       if (!parsedContacts.find((contact) => contact.id == contactId)) {
//         return console.log(`Contact with ID ${contactId} doesn't exist`);
//       }

//       const newContacts = parsedContacts.filter(
//         (contact) => contact.id != contactId
//       );

//       contacts = newContacts;

//       fs.writeFile(contactsPath, JSON.stringify(contacts))
//         .then(console.table(contacts))
//         .catch((err) => console.log(err));
//     })
//     .catch((err) => console.log(err));
// }

async function addContact(name, email, phone) {
  try {
    const contactsList = await getContactsList();

    const contact = {
      id: uniqId(),
      name,
      email,
      phone,
    };

    if (
      contactsList.find(
        ({ email }) => email.toLowerCase() === contact.email.toLowerCase()
      )
    ) {
      return console.log(`Contact with email ${email} already exist`);
    }
    if (contactsList.find(({ phone }) => phone === contact.phone)) {
      return console.log(`Contact with number ${phone} already exist`);
    }

    contactsList.push(contact);

    write_n_showContacts(contactsList);
  } catch (error) {
    console.log(error);
  }
}

// function addContact(name, email, phone) {
//   let contacts = [];

//   fs.readFile(contactsPath)
//     .then((data) => {
//       contacts = JSON.parse(data);
//       const contact = {
//         id: uniqId(),
//         name,
//         email,
//         phone,
//       };

//       contacts.push(contact);

//       fs.writeFile(contactsPath, JSON.stringify(contacts))
//         .then(console.table(contacts))
//         .catch((err) => console.log(err));
//     })
//     .catch((err) => console.log(err));
// }

module.exports = {
  showContactsList,
  getContactById,
  removeContact,
  addContact,
};
