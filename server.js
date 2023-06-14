import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/todo-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.sendStatus(500);
  }
});

app.post('/todos', async (req, res) => {
  const { text, completed } = req.body;
  const newTodo = new Todo({
    text,
    completed
  });

  try {
    await newTodo.save();
    res.sendStatus(201);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.sendStatus(500);
  }
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  try {
    await Todo.findByIdAndUpdate(id, { text, completed });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error editing todo:', error);
    res.sendStatus(500);
  }
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.sendStatus(500);
  }
});




app.listen(3000, () => {
  console.log('Listening 3000');
});







