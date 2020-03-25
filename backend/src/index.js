const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
/*
*Métodos HTTP:
*
*GET: Buscar/listar uma informação do back-end
*POST: Criar uma informação no back-end
*PUT: Alterar uma informação no back-end
*DELETE: Deletar uma informação no back-end
*/

/**
 * Tipos de parâmetros: 
 * 
 * Query: Parâmetros nomeados enviados na rota após o "?" (Filtros, Paginação)
 * Route Params: Parâmetros utilizados para identificar recursos
 * Request Body: Corpo da requisição, utilizado para criar ou alterar recursos
 */

/**
 * SQL: MySQL, SQLite (Usaremos este pq n precisa instalar nada, só criar um arquivo), PostgreeSQL, Oracle, Microsoft SQL Server
 * NoSQL: MongoDB, CouchDB, etc
 */

 /**
  * Banco de dados
  * Driver: SELECT * FROM users
  * Query Builder: table('users').select('*').where()
  * usaremos query builder >knex.js<
  */



app.listen(3333);