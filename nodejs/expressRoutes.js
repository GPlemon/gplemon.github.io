const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const vendingMachine = [
  {
    id: 1,
    name: 'Gum',
    price: 1.25,
  },
  {
    id: 7,
    name: 'Bag of chips',
    price: 3.50,
  },
  {
    id: 23,
    name: 'cumin',
    price: .75,
  }
];

let nextSnackId = 24;

app.use(bodyParser.json());

// Add your code here:
app.param('snackId', (req, res, next, id) => {
  const snackId = Number(id);
  const snackIndex = vendingMachine.findIndex(snack => snack.id === snackId);
  if (snackIndex === -1) {
    res.status(404).send('Snack not found!');
  } else {
    req.snackIndex = snackIndex;
    next();
  }
});

app.get('/snacks/', (req, res, next) => {
  res.send(vendingMachine);
});

app.post('/snacks/', (req, res, next) => {
  const newSnack = req.body;
  if (!newSnack.name || !newSnack.price) {
    res.status(400).send('Snack not found!');
  } else {
    newSnack.id = nextSnackId++;
    vendingMachine.push(newSnack);
    res.send(newSnack);
  }
});

app.get('/snacks/:snackId', (req, res, next) => {
  res.send(vendingMachine[req.snackIndex]);
});

app.put('/snacks/:snackId', (req, res, next) => {
  vendingMachine[req.snackIndex] = req.body;
  res.send(vendingMachine[req.snackIndex]);
});

app.delete('/snacks/:snackId', (req, res, next) => {
  vendingMachine.splice(req.snackIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
