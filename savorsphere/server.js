const express = require('express');
const { join } = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();

app.use(express.json());

app.use(session({
  secret: 'XJ5ey34FNJv68xRTEuObtD17Z4pOP2RB',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use true for HTTPS
}));

app.use(express.static(__dirname));

const recipeConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ' ',
  database: 'recipes_db',
});

const accountConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ' ',
  database: 'account_db',
});

app.post('/api/signup', (req, res) => {
  const { email, password, username } = req.body;

  accountConnection.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], (err, results) => {
    if (err) {
      console.error('Error during signup query:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email or Username already exists' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ error: 'Error hashing password' });
      }

      accountConnection.query(
        'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
        [email, hashedPassword, username],
        (err) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Error creating user' });
          }

          res.status(201).json({ message: 'User created successfully' });
        }
      );
    });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  accountConnection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error during login query:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing password:', err);
        return res.status(500).json({ error: 'Error comparing password' });
      }

      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      req.session.user = { uid: user.uid, username: user.username, email: user.email };
      res.status(200).json({ message: 'Login successful', user: { username: user.username, email: user.email } });
    });
  });
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/loginsignup/*', (req, res) => {
  res.sendFile(join(__dirname, 'loginsignup', req.params[0]));
});

app.get('/homepage/*', (req, res) => {
  res.sendFile(join(__dirname, 'homepage', req.params[0]));
});

app.get('/createrecipe', (req, res) => {
  res.sendFile(join(__dirname, 'savorsphere/createrecipe/index.html'));
});

app.post('/api/createrecipe', (req, res) => {
  const { title, body_text, tags, images } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  const uid = req.session.user.uid;
  const author = req.session.user.username;
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

  recipeConnection.query(
    'INSERT INTO recipes (uid, title, author, body_text, tags, images, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [uid, title, author, body_text, tags, images, date],
    (err) => {
      if (err) {
        console.error('Error saving recipe:', err);
        return res.status(500).json({ error: 'Error saving recipe' });
      }

      res.status(201).json({ message: 'Recipe created successfully' });
    }
  );
});

app.get('/api/recipes', (req, res) => {
  recipeConnection.query('SELECT * FROM recipes', (err, results) => {
    if (err) {
      console.error('Error fetching recipes:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    const formattedResults = results.map(recipe => ({
      id: recipe.recipe_id,
      title: recipe.title,
      author: recipe.author,
      date: recipe.date,
      tags: recipe.tags || '',
      images: recipe.images || '',
      body_text: recipe.body_text || ''
    }));

    res.json(formattedResults);
  });
});

// ✅ Fixed the route to match the frontend request
app.get('/api/recipes/:id', (req, res) => {
  const recipeId = req.params.id;

  recipeConnection.query('SELECT * FROM recipes WHERE recipe_id = ?', [recipeId], (err, results) => {
    if (err) {
      console.error('Error fetching recipe:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = results[0];

    res.json({
      id: recipe.recipe_id,
      title: recipe.title,
      author: recipe.author,
      date: recipe.date,
      tags: recipe.tags || '',
      images: recipe.images || '',
      body_text: recipe.body_text || ''
    });
  });
});

app.get('/account', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/loginsignup/index.html');
  }

  const uid = req.session.user.uid;

  accountConnection.query('SELECT * FROM users WHERE uid = ?', [uid], (err, userResults) => {
    if (err || userResults.length === 0) {
      return res.status(500).json({ error: 'User not found' });
    }

    const user = userResults[0];

    recipeConnection.execute('SELECT * FROM recipes WHERE uid = ?', [uid], (err, recipeResults) => {
      if (err) {
        return res.status(500).json({ error: 'Error retrieving recipes' });
      }

      const recipes = recipeResults.map(recipe => ({
        id: recipe.recipe_id,
        uid: recipe.uid,
        title: recipe.title,
        date: recipe.date,
        author: recipe.author,
        tags: recipe.tags || '',
        images: recipe.images || '',
        body_text: recipe.body_text || ''
      }));

      res.json({ user: { username: user.username, uid: user.uid }, recipes });
    });
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.redirect('/loginsignup/index.html');
  });
});

// Serve About page
app.get('/savorsphere/about', (req, res) => {
  res.sendFile(join(__dirname, 'savorsphere/about/index.html'));
});


app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});

