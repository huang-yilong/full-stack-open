require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const Person = require("./models/person");

const morgan = require("morgan");
morgan.token("body", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : "",
);

app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

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
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res, next) => {
  const date = new Date();
  Person.find({})
    .then((persons) => {
      res.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`,
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send("Person not found");
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required" });
  }

  Person.find({ name: name }).then((result) => {
    if (result.length > 0) {
      return res.status(400).json({ error: "Name must be unique" });
    }
  });

  const newPerson = new Person({
    name,
    number,
  });
  newPerson.save().then((savedPerson) => {
    res.status(201).json(savedPerson);
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send("Person not found");
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).send("Person not found");
      }
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
