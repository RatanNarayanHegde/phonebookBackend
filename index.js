require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

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

app.get("/info", (request, response) => {
  let totalPersons;
  Person.find({}).then((persons) => {
    totalPersons = persons.length;
  });
  response.send(`The phonebook has ${totalPersons} people \n
   ${new Date()}`);
  console.log(
    `<p>The phonebook has ${totalPersons} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
    ``;
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
