import { pool } from './pool.js';

class BezosCompaniesModel {
  constructor() {
    this.pool = pool;
    this.table = 'bezosCompanies';
    this.pool.on(
      'error',
      (err, client) => `Error, ${err}, on idle client${client}`
    );
  }

  async selectMerchants() {
    const query = `SELECT merchant_name FROM ${this.table}`;
    return this.pool.query(query);
  }

  async insertUniqueMerchant(merchantName) {
    const query = `
          INSERT INTO ${this.table}(merchant_name)
          SELECT * FROM (
            VALUES ('${merchantName}')
          ) AS temp(merchant_name)
          WHERE NOT EXISTS (
              SELECT merchant_name FROM ${this.table} WHERE merchant_name = temp.merchant_name
          )
      `;
    return this.pool.query(query);
  }

  async deleteMerchant(merchantName) {
    const query = `DELETE FROM ${this.table} WHERE merchant_name = '${merchantName}' `;
    return this.pool.query(query);
  }
}

export default BezosCompaniesModel;
