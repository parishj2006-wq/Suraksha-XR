const Module = require('../models/Module');

exports.createModule = async (req, res) => {
  try {
    const newModule = await Module.create({ ...req.body, createdBy: req.userId });
    res.status(201).json(newModule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.status(200).json(modules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    res.status(200).json(module);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const updated = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};