const db = require('../models'); // Import your Sequelize models
const Entry = db.Entry;

// Create a new Entry
exports.createEntry = async (req, res) => {
  try {
    const { title , content , references , img } = req.body;
    const newEntry = await Entry.create({ title , content , references , img });
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


// Get a single Entry by ID
exports.getEntryById = async (req, res) => {
  const { id } = req.params;
  try {
    const Entry = await Entry.findByPk(id);
    if (!Entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }
    res.status(200).json(Entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching Entry' });
  }
};

// Update a Entry by ID
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

// Delete a Entry by ID
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
