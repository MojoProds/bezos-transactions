import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import BezosCompaniesModel from './models/bezosCompaniesModel.js';

dotenv.config();
const app = express();
const port = process.env.PORT;
const transactionApiUrl = process.env.TRANSACTION_API;
const bezosCompaniesModel = new BezosCompaniesModel();

app.use(express.json());

function getTransactions(url) {
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => console.log(error));
}

function getBezosCompaniesSet() {
  return bezosCompaniesModel
    .selectMerchants()
    .then((result) => new Set(result.rows.map((row) => row.merchant_name)));
}

function processData(jsonData, bezosCompanies) {
  let totalBalance = 0.0;
  let bezosBalance = 0.0;
  jsonData.map((transaction) => {
    const newTransaction = transaction;
    newTransaction.isBezosCompany = bezosCompanies.has(
      transaction.merchant_name
    );
    totalBalance += newTransaction.amount;
    if (newTransaction.isBezosCompany) {
      bezosBalance += newTransaction.amount;
    }
    return newTransaction;
  });
  return {
    totalBalance,
    bezosBalance,
    bezosPercentage: Math.round((bezosBalance / totalBalance) * 10000) / 100,
    transactions: jsonData,
  };
}

app.get('/transactions', (request, response) => {
  Promise.all([getTransactions(transactionApiUrl), getBezosCompaniesSet()])
    .then((values) => processData(values[0], values[1]))
    .then((processedData) => response.json(processedData));
});

app.post('/merchant', (request, response) => {
  const merchant = request.body;
  if (merchant.isBezosCompany) {
    bezosCompaniesModel.insertUniqueMerchant(merchant.merchant_name);
    response.send(`${merchant.merchant_name} marked as Bezos!`);
  } else {
    bezosCompaniesModel.deleteMerchant(merchant.merchant_name);
    response.send(`${merchant.merchant_name} marked as not Bezos!`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
