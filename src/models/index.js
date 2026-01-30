const User = require("./User");
const Category = require("./Category");
const Transaction = require("./Transaction");

// User tem muitas Categories
User.hasMany(Category, { foreignKey: "userId", onDelete: "CASCADE" });
Category.belongsTo(User, { foreignKey: "userId" });

// User tem muitas Transactions
User.hasMany(Transaction, { foreignKey: "userId", onDelete: "CASCADE" });
Transaction.belongsTo(User, { foreignKey: "userId" });

// Category tem muitas Transactions
Category.hasMany(Transaction, {
  foreignKey: "categoryId",
  onDelete: "SET NULL",
});
Transaction.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = { User, Category, Transaction };
