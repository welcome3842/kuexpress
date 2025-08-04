const db = require("../models");
const Wallet = db.Wallet;
const Transaction = db.Transaction ;

const walletService = {
  async deductWalletBalance(userId, amount, reason = 'Shipment Charge') {
    try {
      const wallet = await Wallet.findOne({ where: { userId } });

      if (!wallet) {
        return { success: false, message: "Insufficient balance" };
      }

      const currentBalance = parseFloat(wallet.balance);
      const deductAmount = parseFloat(amount);

      if (currentBalance < deductAmount) {
        return { success: false, message: "Insufficient balance" };
      }

      wallet.balance = currentBalance - deductAmount;
      await wallet.save();

        Transaction.create({
            userId: userId,
            walletId: wallet.id,
            type: "debit",
            amount:deductAmount,
            balance_after: wallet.balance,
            reason
        });
      return { success: true, message: "Balance deducted", balance: wallet.balance };
    } catch (error) {
      console.error("Error deducting wallet balance:", error);
      return { success: false, message: "Wallet deduction failed", error };
    }
  },

  async refundWalletBalance(userId, amount, reason = 'Shipment Refund',) {
    try {
      const wallet = await Wallet.findOne({ where: { userId } });

      if (!wallet) {
        return { success: false, message: "Wallet not found" };
      }

      const refundAmount = parseFloat(amount);
      wallet.balance = parseFloat(wallet.balance) + refundAmount;
      await wallet.save();

       Transaction.create({
            userId: userId,
            walletId: wallet.id,
            type: "credit",
            amount: refundAmount,
            balance_after: wallet.balance,
            reason
        });
      return { success: true, message: "Refund successful", balance: wallet.balance };
    } catch (error) {
      console.error("Error refunding wallet balance:", error);
      return { success: false, message: "Refund failed", error };
    }
  },
};

module.exports = walletService;
