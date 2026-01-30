const { Category } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.userId },
      order: [["name", "ASC"]],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, type, color } = req.body;

    const category = await Category.create({
      name,
      type,
      color: color || "#3B82F6",
      userId: req.userId,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, color } = req.body;

    const category = await Category.findOne({
      where: { id, userId: req.userId },
    });

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    await category.update({ name, type, color });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id, userId: req.userId },
    });

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    await category.destroy();
    res.json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
