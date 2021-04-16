const fs = require('fs').promises;
const path = require('path');
const uniqId = require('uniqid');

const contactsPath = path.join(__dirname, './db/contacts.json');

async function writeAndShowContacts(data) {
  try {
    fs.writeFile(contactsPath, JSON.stringify(data, null, '\t')).then(console.table(data));
  } catch (error) {
    console.log(error);
  }
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
    contactToShow ? console.table(contactToShow) : console.log(`Contact with ID ${contactId} not found`);
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  let contacts = [];
  try {
    const contactsList = await getContactsList();

    if (!contactsList.find((contact) => contact.id == contactId)) {
      return console.log(`Contact with ID ${contactId} doesn't exist`);
    }

    const newContacts = contactsList.filter((contact) => contact.id != contactId);

    contacts = newContacts;
    writeAndShowContacts(contacts);
  } catch (error) {
    console.log(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contactsList = await getContactsList();
    const contact = {
      id: uniqId(),
      name,
      email,
      phone,
    };

    if (contactsList.find(({ email }) => email.toLowerCase() === contact.email.toLowerCase())) {
      return console.log(`Contact with email ${email} already exist`);
    }

    if (contactsList.find(({ phone }) => phone === contact.phone)) {
      return console.log(`Contact with number ${phone} already exist`);
    }

    contactsList.push(contact);

    writeAndShowContacts(contactsList);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  showContactsList,
  getContactById,
  removeContact,
  addContact,
};
