const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});

app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :body"));
app.use(express.static("build"));

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const totalPersons = persons.length;
  response.send(`The phonebook has ${totalPersons} people \n
   ${new Date()}`);
  console.log(
    `<p>The phonebook has ${totalPersons} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing",
    });
  }
  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({
      error: "The name already exists",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: getRandomInt(100),
  };

  persons = persons.concat(person);
  // console.log(persons);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
