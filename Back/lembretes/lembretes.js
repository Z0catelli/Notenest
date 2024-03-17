const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors({
  origin: '*'
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

// Rota para criar um lembrete
app.post("/lembretes", async (req, res) => {
  const { nome_lembrete, data_lembrete, categoria, concluido, dia_semana } = req.body;
  console.log("-----------------------");
  console.log(nome_lembrete);
  console.log(data_lembrete);
  console.log(categoria);
  console.log(concluido);
  console.log("-----------------------");
  const [results] = await db.execute(
    "INSERT INTO lembretes (nome_lembrete, data_lembrete, categoria, concluido, dia_semana) VALUES (?, ?, ?, ?, ?)",
    [nome_lembrete || null, data_lembrete || null, categoria || null, concluido || null, dia_semana]
  );
  const id_lembrete = results.insertId;
  res.status(201).json({
    id_lembrete: id_lembrete,
    nome_lembrete,
    data_lembrete,
    categoria,
    concluido,
    dia_semana,
  });
});

// Rota para listar todos os lembretes
app.get("/lembretes", async (req, res) => {
  const [lembretes] = await db.execute("SELECT * FROM lembretes");
  res.json(lembretes);
});

//editar lembrete
app.put("/lembretes/:id_lembrete", async (req, res) => {
  const idLembrete = req.params.id_lembrete;
console.log('body',req.body)
  const [lembrete] = await db.execute(
    "SELECT * FROM lembretes WHERE id_lembrete = ?",
    [idLembrete]
  );

  if (lembrete.length > 0) {
    try {
      await db.execute(
        "UPDATE lembretes SET nome_lembrete = ? ,data_lembrete = ?, categoria = ?, concluido = ? WHERE id_lembrete = ?",
        [
        req.body.nome_lembrete, 
        req.body.data_lembrete || null, 
        req.body.categoria,
        req.body.concluido, 
        idLembrete
        ]
      );
      res.json({ message: "Lembrete alterado com sucesso." });
    } catch (error) {
      console.error("Erro na atualização do lembrete:", error);
      res.status(500).json({ error: "Erro interno do servidor ao atualizar o lembrete." });
    }

  } else {
    res.status(404).json({ error: "Lembrete não encontrado." });
  }
});

// // Rota para listar um lembrete por ID
// app.get("/lembretes/:id", async (req, res) => {
//   const [lembrete] = await db.execute(
//     "SELECT * FROM lembretes WHERE id_lembrete = ?",
//     [req.params.id]
//   );

//   if (lembrete.length > 0) {
//     res.json(lembrete[0]);
//   } else {
//     res.status(404).json({ error: "Lembrete não encontrado." });
//   }
// });

// // Rota para listar lembretes por data
// app.get("/lembretes/data/:data_lembrete", async (req, res) => {
//   const dataLembrete = req.params.data_lembrete;
//   const [lembretesPorData] = await db.execute(
//     "SELECT * FROM lembretes WHERE data_lembrete = ?",
//     [dataLembrete]
//   );

//   if (lembretesPorData.length > 0) {
//     res.json(lembretesPorData);
//   } else {
//     res
//       .status(404)
//       .json({ error: "Nenhum lembrete encontrado para a data especificada." });
//   }
// });

// // Rota para listar lembretes por parte de uma data
// app.get("/lembretes/buscar-data/:parte_data", async (req, res) => {
//   const parteData = req.params.parte_data.toLowerCase();

//   const [lembretesEncontrados] = await db.execute(
//     "SELECT * FROM lembretes WHERE LOWER(data_lembrete) LIKE ?",
//     [`%${parteData}%`]
//   );

//   if (lembretesEncontrados.length > 0) {
//     res.json(lembretesEncontrados);
//   } else {
//     res.status(404).json({
//       error: "Nenhum lembrete encontrado para a parte da data especificada.",
//     });
//   }
// });


// // Rota para marcar um lembrete como concluído
// app.put("/lembretes/concluir/:id_lembrete", async (req, res) => {
//   const idLembrete = req.params.id_lembrete;

//   const [lembrete] = await db.execute(
//     "SELECT * FROM lembretes WHERE id_lembrete = ?",
//     [idLembrete]
//   );

//   if (lembrete.length > 0) {
//     await db.execute(
//       "UPDATE lembretes SET concluido = true WHERE id_lembrete = ?",
//       [idLembrete]
//     );

//     res.json({ message: "Lembrete marcado como concluído com sucesso." });
//   } else {
//     res.status(404).json({ error: "Lembrete não encontrado." });
//   }
// });

// Rota para excluir um lembrete por ID
app.delete("/lembretes/:id", async (req, res) => {
  const idLembrete = req.params.id;

  const [lembrete] = await db.execute(
    "SELECT * FROM lembretes WHERE id_lembrete = ?",
    [idLembrete]
  );

  if (lembrete.length > 0) {
    await db.execute("DELETE FROM lembretes WHERE id_lembrete = ?", [
      idLembrete,
    ]);

    res.json({ message: "Lembrete excluído com sucesso." });
  } else {
    res.status(404).json({ error: "Lembrete não encontrado." });
  }
});

async function produce(mensagem) {
  console.log("Publishing");
  var amqp_url = "amqp://guest:guest@localhost";
  var conn = await amqplib.connect(amqp_url);

  var ch = await conn.createChannel();
  var exch = "test_lembretes";
  var q = "lembretes";
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
