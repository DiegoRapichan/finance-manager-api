const { Transaction, Category } = require("../models");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const { startDate, endDate, type, categoryId } = req.query;

    let where = { userId: req.userId };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    if (type) {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const transactions = await Transaction.findAll({
      where,
      include: [
        {
          model: Category,
          attributes: ["id", "name", "color"],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { description, amount, type, date, categoryId } = req.body;

    const transaction = await Transaction.create({
      description,
      amount,
      type,
      date,
      categoryId,
      userId: req.userId,
    });

    const result = await Transaction.findByPk(transaction.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name", "color"],
        },
      ],
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, date, categoryId } = req.body;

    const transaction = await Transaction.findOne({
      where: { id, userId: req.userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    await transaction.update({
      description,
      amount,
      type,
      date,
      categoryId,
    });

    const result = await Transaction.findByPk(transaction.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name", "color"],
        },
      ],
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: { id, userId: req.userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    await transaction.destroy();
    res.json({ message: "Transação deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
