// @flow

import { Pool, types } from 'pg';
import _ from 'lodash';
import nullthrows from '../flib/nullthrows';

import type {Book, AddEmailPayload, User, CreateAccountPayload, UpdateUserPayload} from '../types';

type Constraint = {
  key: string,
  operator: '=' | '!=' | '<' | '>' | '<=' | '>=' | 'IN' | 'IS' | 'IS NOT',
  value: any,
}

type Order = {
  key: string,
  descending: boolean,
}

export default class PostgresClient {
  pool: Pool

  constructor() {
    // Return timestamps from Postgres as JSON formatted strings instead of JS Dates
    const TIMESTAMPTZ_OID = 1184;
    const TIMESTAMP_OID = 1114;
    types.setTypeParser(TIMESTAMPTZ_OID, timestamp => new Date(timestamp).toJSON());
    types.setTypeParser(TIMESTAMP_OID, timestamp => new Date(timestamp).toJSON());

    this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'bookb',
      password: 'postgres',
      port: 5432,
    });

    console.log('PostgresDataStore: Connecting pool...');
    this.pool.connect((error) => {
      if (error) {
        console.log(`PostgresDataStore: Error connecting pool: ${error}`);
      } else {
        console.log('PostgresDataStore: Connected pool.');
      }
    });
  }

  query: (string, ?Array<any>) => Promise<Array<any>> =
    (text: string, vars: ?Array<any> = null) => {
      const query = {
        text,
        values: vars,
      };
      // this.logger(`PostgresDataStore: Executing query: ${JSON.stringify(query, null, 2)}`)
      return this.pool.query(query).then(res => res.rows)
        .catch(error => Promise.reject(new Error(`PostgresDataStore query error: ${error.message}. SQL: ${text}, Vars: ${nullthrows(JSON.stringify(vars, null, 2))}`)));
    }

  select: (string, Array<Constraint>, ?Order, ?number, ?number) => Promise<Array<any>> =
    (table: string, constraints: Array<Constraint>, order: ?Order,
      offset: ?number, limit: ?number) => {
      let paramCount = 0;
      const whereClause = constraints.length > 0
        ? `WHERE ${constraints.map(
          (constraint) => {
            if (constraint.operator === 'IN') {
              return `"${constraint.key}" IN (${constraint.value.map(() => {
                paramCount += 1;
                return `$${paramCount}`;
              }).join(', ')})`;
            }
            if (constraint.value === null) {
              return `"${constraint.key}" ${constraint.operator} NULL`;
            }
            paramCount += 1;
            return `"${constraint.key}" ${constraint.operator} $${paramCount}`;
          },
        ).join(' AND ')}`
        : '';
      const orderByClause = order ? `ORDER BY "${order.key}" ${order.descending ? 'DESC' : 'ASC'}` : '';
      const limitClause = limit ? `LIMIT ${limit}` : '';
      const offsetClause = offset ? `OFFSET ${offset}` : '';
      const sql = `SELECT * FROM "${table}" ${whereClause} ${orderByClause} ${limitClause} ${offsetClause}`;
      const vars = _.flatten(constraints.map(
        constraint => constraint.value,
      )).filter(v => v !== null);
      // this.logger('SQL:', sql)
      // this.logger('vars:', vars)
      return this.query(sql, vars).catch(error => Promise.reject(new Error(`PostgresDataStore select error: ${error}`)));
    }

  selectOne: (string, Array<Constraint>, ?Order, ?number, ?number) => Promise<?any> =
    (table: string, constraints: Array<Constraint>, order: ?Order, offset: ?number, limit: ?number) => this.select(table, constraints, order, offset, limit).then(rows => (rows.length > 0 ? rows[0] : null)).catch(error => Promise.reject(new Error(`PostgresDataStore selectOne error: ${error}`)))

  insert: (string, any, ?boolean) => Promise<any> =
    (table: string, payload: any, ignoreConflict: ?boolean = false) => {
      const keys = _.keys(payload);
      const columnsString = keys.map(key => `"${key}"`).join(', ');
      const valuePlaceholders = Array(keys.length).fill().map((e, i) => i + 1).map(i => `$${i}`)
        .join(', ');
      const sql = `INSERT INTO "${table}" (${columnsString}) VALUES (${valuePlaceholders}) ${ignoreConflict ? 'ON CONFLICT DO NOTHING ' : ''}RETURNING *`;
      const vars = keys.map(key => payload[key]);
      return this.query(sql, vars).then(rows => rows[0]).catch(error => Promise.reject(new Error(`PostgresDataStore insert error: ${error}`)));
    }

  update: (string, any, Array<Constraint>) => Promise<Array<any>> =
    (table: string, payload: any, constraints: Array<Constraint>) => {
      if (constraints.length < 1) {
        return Promise.reject(new Error('PostgresDataStore update error: must have at least one constraint'));
      }
      let paramCount = 0;
      const keys = _.keys(payload);
      const updateString = keys.map((key) => {
        paramCount += 1;
        return `"${key}" = $${paramCount}`;
      }).join(', ');
      const whereClause = `WHERE ${constraints.map(
        (constraint) => {
          if (constraint.operator === 'IN') {
            return `"${constraint.key}" IN (${constraint.value.map(() => {
              paramCount += 1;
              return `$${paramCount}`;
            }).join(', ')})`;
          }
          if (constraint.value === null) {
            return `"${constraint.key}" ${constraint.operator} NULL`;
          }
          paramCount += 1;
          return `"${constraint.key}" ${constraint.operator} $${paramCount}`;
        },
      ).join(' AND ')}`;
      const sql = `UPDATE "${table}" SET ${updateString} ${whereClause} RETURNING *`;
      const vars = [
        ...keys.map(key => payload[key]),
        ..._.flatten(constraints.map(constraint => constraint.value)).filter(v => v !== null),
      ];
      return this.query(sql, vars).catch(error => Promise.reject(new Error(`PostgresDataStore update error: ${error}`)));
    }

  updateOne: (string, any, Array<Constraint>) => Promise<any> =
    (table: string, payload: any, constraints: Array<Constraint>) => this.update(
      table, payload, constraints,
    ).then((rows) => {
      if (rows.length < 1) {
        return Promise.reject(new Error('PostgresDataStore updateOne error: Nothing got updated'));
      }
      return rows[0];
    }).catch(error => Promise.reject(new Error(`PostgresDataStore updateOne error: ${error}`)))

  delete: (string, Array<Constraint>) => Promise<any> =
    (table: string, constraints: Array<Constraint>) => {
      if (constraints.length < 1) {
        return Promise.reject(new Error('PostgresDataStore delete error: must have at least one constraint'));
      }
      let paramCount = 0;
      const whereClause = `WHERE ${constraints.map(
        (constraint) => {
          if (constraint.operator === 'IN') {
            return `"${constraint.key}" IN (${constraint.value.map(() => {
              paramCount += 1;
              return `$${paramCount}`;
            }).join(', ')})`;
          }
          if (constraint.value === null) {
            return `"${constraint.key}" ${constraint.operator} NULL`;
          }
          paramCount += 1;
          return `"${constraint.key}" ${constraint.operator} $${paramCount}`;
        },
      ).join(' AND ')}`;
      const sql = `DELETE FROM "${table}" ${whereClause} RETURNING *`;
      const vars = _.flatten(
        constraints.map(constraint => constraint.value),
      ).filter(v => v !== null);
      return this.query(sql, vars).catch(error => Promise.reject(new Error(`PostgresDataStore delete error: ${error}`)));
    }

  deleteOne: (string, Array<Constraint>) => Promise<any> =
    (table: string, constraints: Array<Constraint>) => this.delete(
      table, constraints,
    ).then((rows) => {
      if (rows.length < 1) {
        return Promise.reject(new Error('PostgresDataStore deleteOne error: Nothing got deleted'));
      }
      return rows[0];
    }).catch(error => Promise.reject(new Error(`PostgresDataStore deleteOne error: ${error}`)))

  getBooks: () => Promise<Array<Book>> = () => {
    return this.select('books', []);
  }

  getUserById: number => Promise<?User> = (userId: number) => {
    return this.selectOne('users', [ { key: 'id', operator: '=', value: userId } ])
  }

  getUserByEmail: string => Promise<?User> = (email: string) => {
    return this.selectOne('users', [ { key: 'email', operator: '=', value: email } ])
  }

  addEmail: AddEmailPayload => Promise<User> = (payload: AddEmailPayload) => {
    return this.insert('users', payload, true /*ignoreConflict*/)
  }

  updateUser: (number, UpdateUserPayload) => Promise<User> = (userId: number, payload: UpdateUserPayload) => {
    return this.updateOne('users', payload, [ { key: 'id', operator: '=', value: userId } ])
  }

  createUser: CreateAccountPayload => Promise<User> = (payload: CreateAccountPayload) => {
    return this.insert('users', payload)
  }
}
