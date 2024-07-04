const db = require('../models');
const Entry = db.Entry;
const { imageUpload } = require('../utils/imageUpload')
const decryptor = require('../utils/decryptor')
const { EntrySchema } = require('../helpers/validateAttribute');

exports.createEntry = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please provide image." });
    }
    const { title, content, references } = req.body;
    const { error } = EntrySchema.validate({ title, content, references })
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let img = null;
    const user_id = req.user?.id
    try {
      img = await imageUpload(req.file, 'entries');
    } catch (uploadError) {
      return res.status(500).json({ message: 'Error uploading image' });
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

exports.getEntryByUserId = async (req, res) => {
  const user_id = req.user?.id

  try {
    const entry = await Entry.findAll({
      where: {
        user_id: user_id,
      },
    });;
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
    const { title, content, references } = req.body;
    const { error } = EntrySchema.validate({ title, content, references })
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let payload
    if (req.file) {
      try {
        const img = await imageUpload(req.file, 'entries');
        payload = { title, content, references, img }
      } catch (uploadError) {
        return res.status(500).json({ message: 'Error uploading image' });
      }
    } else {
      payload = { title, content, references }
    }
    const updatedEntry = await Entry.update(payload, {
      where: { id },
    });
    if (updatedEntry){
      res.status(200).json({ message: 'Entry updated successfully' });
    }
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
  const { actionType, comment } = decryptedData;

  let data = {};
  if (actionType === 'accept') {
    data.status = '1';
    data.comment = null;
  } else if (actionType === 'reject') {
    data.status = '2';
    data.comment = comment;
  } else {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  try {
    const updatedEntry = await Entry.update(data, {
      where: { id },
    });
    if (updatedEntry) {
      res.status(200).json({ message: 'Entry status updated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating Entry' });
  }
};