const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is working!' });
});

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // default XAMPP password is empty
  database: 'smart_investment'
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
    console.log('Starting server without database connection...');
    return false;
  }
}

// Initialize database tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('Creating database tables...');
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('investor', 'creator') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created/verified');

    // Create movies table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        poster VARCHAR(255),
        director VARCHAR(255),
        producer VARCHAR(255),
        singer VARCHAR(255),
        hero VARCHAR(255),
        heroine VARCHAR(255),
        total_amount DECIMAL(15,2) NOT NULL,
        invested_amount DECIMAL(15,2) DEFAULT 0,
        stock_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        creator_id VARCHAR(36),
        FOREIGN KEY (creator_id) REFERENCES users(id)
      )
    `);
    console.log('Movies table created/verified');

    // Create investments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS investments (
        id VARCHAR(36) PRIMARY KEY,
        movie_id VARCHAR(36),
        investor_id VARCHAR(36),
        total_amount DECIMAL(15,2) NOT NULL,
        stock_count INT NOT NULL,
        stock_price DECIMAL(10,2) NOT NULL,
        payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (movie_id) REFERENCES movies(id),
        FOREIGN KEY (investor_id) REFERENCES users(id)
      )
    `);
    console.log('Investments table created/verified');

    connection.release();
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Insert sample data for testing
async function insertSampleData() {
  try {
    const connection = await pool.getConnection();
    
    // Check if users table is empty
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (users[0].count === 0) {
      console.log('Inserting sample users...');
      
      // Insert sample users
      await connection.query(`
        INSERT INTO users (id, username, email, password, role) VALUES 
        ('1', 'investor1', 'investor1@example.com', 'password123', 'investor'),
        ('2', 'creator1', 'creator1@example.com', 'password123', 'creator')
      `);
      
      // Insert sample movies
      await connection.query(`
        INSERT INTO movies (id, title, poster, director, producer, singer, hero, heroine, total_amount, stock_price, creator_id) VALUES 
        ('1', 'The Last Adventure', 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Last+Adventure', 'John Director', 'Jane Producer', 'Music Artist', 'Hero Actor', 'Heroine Actress', 1000000.00, 100.00, '2'),
        ('2', 'Future Dreams', 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Future+Dreams', 'Sarah Director', 'Mike Producer', 'Pop Singer', 'Star Actor', 'Star Actress', 2000000.00, 150.00, '2'),
        ('3', 'Mountain Journey', 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Mountain+Journey', 'David Director', 'Lisa Producer', 'Rock Band', 'Lead Actor', 'Lead Actress', 1500000.00, 120.00, '2')
      `);
      
      // Insert sample investments
      await connection.query(`
        INSERT INTO investments (id, movie_id, investor_id, total_amount, stock_count, stock_price) VALUES 
        ('1', '1', '1', 5000.00, 50, 100.00),
        ('2', '2', '1', 7500.00, 50, 150.00)
      `);
      
      // Update movie invested amounts
      await connection.query(`
        UPDATE movies SET invested_amount = 5000.00 WHERE id = '1'
      `);
      await connection.query(`
        UPDATE movies SET invested_amount = 7500.00 WHERE id = '2'
      `);
      
      console.log('Sample data inserted successfully');
    }
    
    connection.release();
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Authentication routes
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log('Signup attempt:', { username, email, role });
    
    const connection = await pool.getConnection();
    
    // Check if user exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      console.log('User already exists:', existingUsers[0]);
      connection.release();
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const userId = Date.now().toString();
    await connection.query(
      'INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, username, email, password, role]
    );
    
    console.log('User created successfully:', { id: userId, username, email, role });
    connection.release();
    res.json({ success: true, user: { id: userId, username, email, role } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    
    connection.release();
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    res.json({ success: true, user: { ...user, password: undefined } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Movies routes
app.get('/api/movies', async (req, res) => {
  try {
    const { creatorId } = req.query;
    const connection = await pool.getConnection();
    
    let query = 'SELECT * FROM movies';
    let params = [];
    
    if (creatorId) {
      query += ' WHERE creator_id = ?';
      params.push(creatorId);
    }
    
    const [movies] = await connection.query(query, params);
    connection.release();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [movies] = await connection.query(
      'SELECT * FROM movies WHERE id = ?',
      [req.params.id]
    );
    
    connection.release();
    
    if (movies.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(movies[0]);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const movie = {
      id: Date.now().toString(),
      ...req.body,
      invested_amount: 0
    };
    
    await connection.query(
      'INSERT INTO movies (id, title, poster, director, producer, singer, hero, heroine, total_amount, stock_price, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [movie.id, movie.title, movie.poster, movie.director, movie.producer, movie.singer, movie.hero, movie.heroine, movie.total_amount, movie.stock_price, movie.creator_id]
    );
    
    connection.release();
    res.json(movie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const updateFields = [];
    const updateValues = [];
    
    Object.keys(req.body).forEach(key => {
      if (key !== 'id') {
        updateFields.push(`${key} = ?`);
        updateValues.push(req.body[key]);
      }
    });
    
    updateValues.push(id);
    
    await connection.query(
      `UPDATE movies SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    const [movies] = await connection.query(
      'SELECT * FROM movies WHERE id = ?',
      [id]
    );
    
    connection.release();
    
    if (movies.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(movies[0]);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Investment routes
app.post('/api/investments', async (req, res) => {
  try {
    const { movie_id, investor_id, total_amount, stock_count, stock_price } = req.body;
    
    const connection = await pool.getConnection();
    
    // Check if movie exists
    const [movies] = await connection.query(
      'SELECT * FROM movies WHERE id = ?',
      [movie_id]
    );
    
    if (movies.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    const movie = movies[0];
    const availableStocks = Math.floor((movie.total_amount - movie.invested_amount) / movie.stock_price);
    
    if (stock_count > availableStocks) {
      connection.release();
      return res.status(400).json({ error: 'Not enough stocks available' });
    }
    
    const investment = {
      id: Date.now().toString(),
      movie_id,
      investor_id,
      total_amount,
      stock_count,
      stock_price,
      payment_status: 'pending'
    };
    
    await connection.query(
      'INSERT INTO investments (id, movie_id, investor_id, total_amount, stock_count, stock_price, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [investment.id, investment.movie_id, investment.investor_id, investment.total_amount, investment.stock_count, investment.stock_price, investment.payment_status]
    );
    
    connection.release();
    
    res.json({ 
      success: true, 
      investment_id: investment.id,
      payment_url: `/investor/payment/${investment.id}`,
      message: 'Investment created. Please complete payment to confirm your investment.'
    });
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payment completion endpoint
app.post('/api/investments/:id/complete-payment', async (req, res) => {
  try {
    const { payment_method } = req.body;
    const investmentId = req.params.id;
    
    const connection = await pool.getConnection();
    
    // Get investment details
    const [investments] = await connection.query(
      'SELECT * FROM investments WHERE id = ?',
      [investmentId]
    );
    
    if (investments.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    const investment = investments[0];
    
    if (investment.payment_status === 'completed') {
      connection.release();
      return res.status(400).json({ error: 'Payment already completed' });
    }
    
    // Update investment payment status
    await connection.query(
      'UPDATE investments SET payment_status = ?, payment_method = ? WHERE id = ?',
      ['completed', payment_method, investmentId]
    );
    
    // Update movie invested amount
    await connection.query(
      'UPDATE movies SET invested_amount = invested_amount + ? WHERE id = ?',
      [investment.total_amount, investment.movie_id]
    );
    
    connection.release();
    
    res.json({ 
      success: true, 
      message: 'Payment completed successfully. Your investment has been confirmed!'
    });
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/investments', async (req, res) => {
  try {
    const { creatorId, investorId } = req.query;
    const connection = await pool.getConnection();
    
    let query = 'SELECT i.*, m.title as movie_title FROM investments i JOIN movies m ON i.movie_id = m.id';
    let params = [];
    
    if (creatorId) {
      query += ' WHERE m.creator_id = ?';
      params.push(creatorId);
    } else if (investorId) {
      query += ' WHERE i.investor_id = ?';
      params.push(investorId);
    }
    
    const [investments] = await connection.query(query, params);
    connection.release();
    res.json(investments);
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/investments/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [investments] = await connection.query(
      'SELECT * FROM investments WHERE id = ?',
      [req.params.id]
    );
    
    connection.release();
    
    if (investments.length === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    res.json(investments[0]);
  } catch (error) {
    console.error('Error fetching investment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
console.log('Starting server...');
testConnection()
  .then((connected) => {
    if (connected) {
      return initializeDatabase();
    }
    return false;
  })
  .then((initialized) => {
    if (initialized) {
      return insertSampleData();
    }
    return Promise.resolve();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Failed to start server:', error);
    // Start server anyway without database
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port} (without database)`);
    });
  }); 