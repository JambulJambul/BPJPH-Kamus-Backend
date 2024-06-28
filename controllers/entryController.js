const db = require('../models');
const Entry = db.Entry;
const { imageUpload } = require('../utils/imageUpload')
const decryptor = require('../utils/decryptor')

exports.createEntry = async (req, res) => {
  try {
    const { title, content, references } = req.body;
    let img = null;
    const user_id = req.user?.id
    if (req.file) {
      img = await imageUpload(req.file, 'entries');
    }
    const newEntry = await Entry.create({ user_id, title, content, references, img });
    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating Entry' });
  }
};

exports.getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.findAll();
    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching entries' });
  }
};


exports.getEntryById = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await Entry.findByPk(id);
    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }
    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching Entry' });
  }
};

exports.updateEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const [updatedRows] = await Entry.update(req.body, {
      where: { id },
    });
    if (updatedRows === 0) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }
    res.status(200).json({ message: 'Entry updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating Entry' });
  }
};

exports.deleteEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await Entry.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting Entry' });
  }
};

exports.setEntryStatus = async (req, res) => {
  const decryptedData = decryptor.decryptObject(req.body);
  const { id } = req.params;
  const { actionType } = decryptedData;

  let newStatus;
  if (actionType === 'accept') {
    newStatus = '1'; 
  } else if (actionType === 'reject') {
    newStatus = '2'; 
  } else {
    return res.status(400).json({ message: 'Invalid actionType' });
  }

  try {
    const updatedEntry = await Entry.update({ status: newStatus }, {
      where: { id },
    });
    if (updatedEntry[0] === 0) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating Entry' });
  }
};