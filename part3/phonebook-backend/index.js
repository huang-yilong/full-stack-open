const express = require("express");
const app = express();
const port = 3001;

const morgan = require("morgan");
morgan.token("body", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : "",
);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);
app.use(express.json());

const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`,
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send("Person not found");
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const index = persons.findIndex((p) => p.id === id);
  if (index !== -1) {
    persons.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).send("Person not found");
  }
});

function generateId() {
  while (true) {
    const id = (Math.random() * 1000000).toFixed(0);
    if (!persons.find((p) => p.id === String(id))) {
      return String(id);
    }
  }
}

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required" });
  }

  if (persons.find((p) => p.name === name)) {
    return res.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = {
    id: generateId(),
    name,
    number,
  };
  persons.push(newPerson);
  res.status(201).json(newPerson);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
