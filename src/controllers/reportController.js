const { Transaction, Category } = require("../models");
const { Op, fn, col } = require("sequelize");

exports.getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let where = { userId: req.userId };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const transactions = await Transaction.findAll({
      where,
      attributes: ["type", [fn("SUM", col("amount")), "total"]],
      group: ["type"],
      raw: true,
    });

    const summary = {
      income: 0,
      expense: 0,
      balance: 0,
    };

    transactions.forEach((t) => {
      if (t.type === "income") {
        summary.income = parseFloat(t.total);
      } else if (t.type === "expense") {
        summary.expense = parseFloat(t.total);
      }
    });

    summary.balance = summary.income - summary.expense;

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    let where = { userId: req.userId };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    if (type) {
      where.type = type;
    }

    const transactions = await Transaction.findAll({
      where,
      attributes: [
        "categoryId",
        [fn("SUM", col("Transaction.amount")), "total"], // ← MUDANÇA AQUI
        [fn("COUNT", col("Transaction.id")), "count"], // ← MUDANÇA AQUI
      ],
      include: [
        {
          model: Category,
          attributes: ["name", "color"],
        },
      ],
      group: [
        "Transaction.categoryId",
        "Category.id",
        "Category.name",
        "Category.color",
      ], // ← MUDANÇA AQUI
      order: [[fn("SUM", col("Transaction.amount")), "DESC"]], // ← MUDANÇA AQUI
      raw: false,
    });

    const formatted = transactions.map((t) => ({
      categoryId: t.categoryId,
      categoryName: t.Category?.name || "Sem categoria",
      categoryColor: t.Category?.color || "#999999",
      total: parseFloat(t.dataValues.total),
      count: parseInt(t.dataValues.count),
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthly = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();

    const transactions = await Transaction.findAll({
      where: {
        userId: req.userId,
        date: {
          [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`],
        },
      },
      attributes: [
        [fn("DATE_TRUNC", "month", col("date")), "month"],
        "type",
        [fn("SUM", col("amount")), "total"],
      ],
      group: [fn("DATE_TRUNC", "month", col("date")), "type"],
      order: [[fn("DATE_TRUNC", "month", col("date")), "ASC"]],
      raw: true,
    });

    const monthlyData = {};

    // Inicializa todos os 12 meses
    for (let i = 1; i <= 12; i++) {
      const monthKey = `${currentYear}-${String(i).padStart(2, "0")}`;
      monthlyData[monthKey] = {
        month: monthKey,
        income: 0,
        expense: 0,
        balance: 0,
      };
    }

    // Preenche com dados reais
    transactions.forEach((t) => {
      // Converte Date para string YYYY-MM
      const monthDate = new Date(t.month);
      const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

      if (monthlyData[monthKey]) {
        if (t.type === "income") {
          monthlyData[monthKey].income = parseFloat(t.total);
        } else {
          monthlyData[monthKey].expense = parseFloat(t.total);
        }
      }
    });

    // Calcula balance
    Object.values(monthlyData).forEach((month) => {
      month.balance = month.income - month.expense;
    });

    res.json(Object.values(monthlyData));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
