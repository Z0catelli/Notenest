const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());
const mysql = require("mysql2/promise");
const { v4: uuidv4 } = require("uuid");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "notenest",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3307
});

// Rota para criar um observacao
app.post("/obs", async (req, res) => {
  const { texto, id_lembrete } = req.body;
  console.log("-----------------------");
  console.log(texto);
  console.log(id_lembrete);
  console.log("-----------------------");

  const [results] = await db.execute(
    "INSERT INTO observacoes ( texto, id_lembrete) VALUES (?, ?)",
    [texto || null, id_lembrete || null]
  );
  const id_obs = results.insertId;

  res.status(201).json({ id_obs: id_obs, texto, id_lembrete });
});

// Rota para listar todos as observaçoes
app.get("/obs", async (req, res) => {
  const [observacoes] = await db.execute("SELECT * FROM observacoes");
  res.json(observacoes);
});

// Rota para listar uma observação por ID
app.get("/obs/:id", async (req, res) => {
  const [observacao] = await db.execute(
    "SELECT * FROM observacoes WHERE id_obs = ?",
    [req.params.id]
  );
  if (observacao.length > 0) {
    res.json(observacao[0]);
  } else {
    res.status(404).json({ error: "Observação não encontrada." });
  }
});

//editar obs
app.put("/obs/:id_lembrete", async (req, res) => {
  const idLembrete = req.params.id_lembrete;

  // const [observacao] = await db.execute(
  //   "SELECT * FROM observacoes WHERE id_lembrete = ?",
  //   [idLembrete]
  // );

  // if (observacao.length > 0) {
  await db.execute(
    "UPDATE observacoes SET texto = ? WHERE id_lembrete = ?",
    [req.body.texto, idLembrete]
  );

  res.json({ message: "Observação alterada com sucesso." });
  // } else {
  //   res.status(404).json({ error: "Observação não encontrada." });
  // }
});

// Rota para excluir um lembrete por ID
app.delete("/obs/:id_lembrete", async (req, res) => {
  const id_lembrete = req.params.id_lembrete;
  console.log('idlembrte',id_lembrete)
  // const [observacao] = await db.execute(
  //   "SELECT * FROM observacoes WHERE id_obs = ?",
  //   [id_lembrete]
  // );

  // if (observacao.length > 0) {
  await db.execute("DELETE FROM observacoes WHERE id_lembrete= ?", [id_lembrete]);

  res.json({ message: "Observação excluída com sucesso." });
  // } else {
  //   res.status(404).json({ error: "Observação não encontrada." });
  // }
});

async function produce(mensagem) {
  console.log("Publishing");
  var amqp_url = "amqp://guest:guest@localhost";
  var conn = await amqplib.connect(amqp_url);

  var ch = await conn.createChannel();
  var exch = "test_obs";
  var q = "obs";
  var rkey = "test_route";

  await ch
    .assertExchange(exch, "direct", { durable: true })
    .catch(console.error);
  await ch.assertQueue(q, { durable: true });
  await ch.bindQueue(q, exch, rkey);
  await ch.publish(exch, rkey, Buffer.from(JSON.stringify(mensagem)));
  setTimeout(function () {
    ch.close();
    conn.close();
  }, 500);
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
