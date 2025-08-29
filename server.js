import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectToDatabase, getDatabase, closeConnection } from './config/mongodb.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is working!' });
});

// MongoDB connection
let db;

// Test database connection
async function testConnection() {
  try {
    const { db: database } = await connectToDatabase();
    db = database;
    console.log('Successfully connected to MongoDB database');
  } catch (error) {
    console.error('Error connecting to MongoDB database:', error);
    process.exit(1); // Exit if we can't connect to the database
  }
}

// Initialize database collections and sample data
async function initializeDatabase() {
  try {
    console.log('Initializing MongoDB collections...');
    
    // Create indexes for better performance
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('movies').createIndex({ creator_id: 1 });
    await db.collection('investments').createIndex({ movie_id: 1 });
    await db.collection('investments').createIndex({ investor_id: 1 });
    
    console.log('MongoDB collections initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Insert sample data for testing
async function insertSampleData() {
  try {
    // Check if users collection is empty
    const userCount = await db.collection('users').countDocuments();
    
    if (userCount === 0) {
      console.log('Inserting sample data...');
      
      // Insert sample users
      await db.collection('users').insertMany([
        {
          _id: '1',
          username: 'investor1',
          email: 'investor1@example.com',
          password: 'password123',
          role: 'investor',
          created_at: new Date()
        },
        {
          _id: '2',
          username: 'creator1',
          email: 'creator1@example.com',
          password: 'password123',
          role: 'creator',
          created_at: new Date()
        }
      ]);
      
      // Insert sample movies with comprehensive data
      await db.collection('movies').insertMany([
        {
          _id: '1',
          title: 'The Last Adventure',
          poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Last+Adventure',
          director: 'Christopher Nolan',
          producer: 'Emma Thomas',
          singer: 'Hans Zimmer',
          hero: 'Tom Hardy',
          heroine: 'Marion Cotillard',
          genre: 'Action/Adventure',
          language: 'English',
          duration: '2h 35m',
          release_date: '2024-06-15',
          description: 'A thrilling adventure about a group of explorers who discover ancient secrets in the Amazon rainforest.',
          total_amount: 15000000.00,
          invested_amount: 500000.00,
          stock_price: 150.00,
          creator_id: '2',
          status: 'In Production',
          budget_breakdown: {
            production: 8000000,
            marketing: 4000000,
            distribution: 2000000,
            contingency: 1000000
          },
          cast: ['Tom Hardy', 'Marion Cotillard', 'Cillian Murphy', 'Ellen Page'],
          crew: {
            cinematographer: 'Wally Pfister',
            editor: 'Lee Smith',
            production_designer: 'Nathan Crowley'
          },
          locations: ['Amazon Rainforest', 'London', 'Paris'],
          created_at: new Date()
        },
        {
          _id: '2',
          title: 'Mystery of the Deep',
          poster: 'https://via.placeholder.com/300x450/1e40af/ffffff?text=Mystery+of+the+Deep',
          director: 'James Cameron',
          producer: 'Jon Landau',
          singer: 'James Horner',
          hero: 'Leonardo DiCaprio',
          heroine: 'Kate Winslet',
          genre: 'Sci-Fi/Thriller',
          language: 'English',
          duration: '2h 45m',
          release_date: '2024-08-20',
          description: 'A deep-sea exploration mission uncovers mysterious creatures and ancient underwater civilizations.',
          total_amount: 20000000.00,
          invested_amount: 8000000.00,
          stock_price: 200.00,
          creator_id: '2',
          status: 'Pre-Production',
          budget_breakdown: {
            production: 12000000,
            marketing: 5000000,
            distribution: 2000000,
            contingency: 1000000
          },
          cast: ['Leonardo DiCaprio', 'Kate Winslet', 'Jake Gyllenhaal', 'Rachel McAdams'],
          crew: {
            cinematographer: 'Russell Carpenter',
            editor: 'Conrad Buff',
            production_designer: 'Peter Lamont'
          },
          locations: ['Pacific Ocean', 'Hawaii', 'Australia'],
          created_at: new Date()
        },
        {
          _id: '3',
          title: 'Future City',
          poster: 'https://via.placeholder.com/300x450/059669/ffffff?text=Future+City',
          director: 'Denis Villeneuve',
          producer: 'Mary Parent',
          singer: 'Jóhann Jóhannsson',
          hero: 'Ryan Gosling',
          heroine: 'Ana de Armas',
          genre: 'Sci-Fi/Drama',
          language: 'English',
          duration: '2h 15m',
          release_date: '2024-10-10',
          description: 'A cyberpunk thriller set in a futuristic metropolis where technology and humanity collide.',
          total_amount: 18000000.00,
          invested_amount: 12000000.00,
          stock_price: 180.00,
          creator_id: '2',
          status: 'Post-Production',
          budget_breakdown: {
            production: 10000000,
            marketing: 5000000,
            distribution: 2000000,
            contingency: 1000000
          },
          cast: ['Ryan Gosling', 'Ana de Armas', 'Harrison Ford', 'Jared Leto'],
          crew: {
            cinematographer: 'Roger Deakins',
            editor: 'Joe Walker',
            production_designer: 'Dennis Gassner'
          },
          locations: ['Los Angeles', 'Tokyo', 'Dubai'],
          created_at: new Date()
        },
        {
          _id: '4',
          title: 'The Lost Kingdom',
          poster: 'https://via.placeholder.com/300x450/7c2d12/ffffff?text=The+Lost+Kingdom',
          director: 'Peter Jackson',
          producer: 'Fran Walsh',
          singer: 'Howard Shore',
          hero: 'Viggo Mortensen',
          heroine: 'Liv Tyler',
          genre: 'Fantasy/Adventure',
          language: 'English',
          duration: '3h 15m',
          release_date: '2024-12-25',
          description: 'An epic fantasy adventure about a quest to restore a lost kingdom and its magical artifacts.',
          total_amount: 25000000.00,
          invested_amount: 15000000.00,
          stock_price: 250.00,
          creator_id: '2',
          status: 'In Production',
          budget_breakdown: {
            production: 15000000,
            marketing: 6000000,
            distribution: 3000000,
            contingency: 1000000
          },
          cast: ['Viggo Mortensen', 'Liv Tyler', 'Orlando Bloom', 'Cate Blanchett'],
          crew: {
            cinematographer: 'Andrew Lesnie',
            editor: 'Jamie Selkirk',
            production_designer: 'Grant Major'
          },
          locations: ['New Zealand', 'Scotland', 'Iceland'],
          created_at: new Date()
        },
        {
          _id: '5',
          title: 'Ocean\'s Legacy',
          poster: 'https://via.placeholder.com/300x450/0c4a6e/ffffff?text=Ocean\'s+Legacy',
          director: 'Steven Soderbergh',
          producer: 'Jerry Weintraub',
          singer: 'David Holmes',
          hero: 'George Clooney',
          heroine: 'Sandra Bullock',
          genre: 'Crime/Comedy',
          language: 'English',
          duration: '2h 5m',
          release_date: '2024-09-15',
          description: 'A sophisticated heist film about a team of skilled thieves planning the ultimate casino robbery.',
          total_amount: 12000000.00,
          invested_amount: 6000000.00,
          stock_price: 120.00,
          creator_id: '2',
          status: 'Pre-Production',
          budget_breakdown: {
            production: 7000000,
            marketing: 3000000,
            distribution: 1500000,
            contingency: 500000
          },
          cast: ['George Clooney', 'Sandra Bullock', 'Brad Pitt', 'Julia Roberts'],
          crew: {
            cinematographer: 'Peter Andrews',
            editor: 'Stephen Mirrione',
            production_designer: 'Philip Messina'
          },
          locations: ['Las Vegas', 'Monte Carlo', 'Macau'],
          created_at: new Date()
        },
        {
          _id: '6',
          title: 'The Quantum Effect',
          poster: 'https://via.placeholder.com/300x450/581c87/ffffff?text=The+Quantum+Effect',
          director: 'Christopher Nolan',
          producer: 'Emma Thomas',
          singer: 'Ludwig Göransson',
          hero: 'John David Washington',
          heroine: 'Elizabeth Debicki',
          genre: 'Sci-Fi/Thriller',
          language: 'English',
          duration: '2h 30m',
          release_date: '2024-11-08',
          description: 'A mind-bending thriller about time manipulation and parallel dimensions.',
          total_amount: 16000000.00,
          invested_amount: 10000000.00,
          stock_price: 160.00,
          creator_id: '2',
          status: 'Post-Production',
          budget_breakdown: {
            production: 9000000,
            marketing: 4000000,
            distribution: 2000000,
            contingency: 1000000
          },
          cast: ['John David Washington', 'Elizabeth Debicki', 'Robert Pattinson', 'Kenneth Branagh'],
          crew: {
            cinematographer: 'Hoyte van Hoytema',
            editor: 'Jennifer Lame',
            production_designer: 'Nathan Crowley'
          },
          locations: ['London', 'Mumbai', 'Oslo'],
          created_at: new Date()
        },
        {
          _id: '7',
          title: 'Desert Storm',
          poster: 'https://via.placeholder.com/300x450/92400e/ffffff?text=Desert+Storm',
          director: 'Ridley Scott',
          producer: 'Mark Huffam',
          singer: 'Marc Streitenfeld',
          hero: 'Matt Damon',
          heroine: 'Jessica Chastain',
          genre: 'Action/Drama',
          language: 'English',
          duration: '2h 20m',
          release_date: '2024-07-04',
          description: 'A military drama set during a conflict in the Middle East, exploring themes of survival and brotherhood.',
          total_amount: 14000000.00,
          invested_amount: 7000000.00,
          stock_price: 140.00,
          creator_id: '2',
          status: 'In Production',
          budget_breakdown: {
            production: 8000000,
            marketing: 4000000,
            distribution: 1500000,
            contingency: 500000
          },
          cast: ['Matt Damon', 'Jessica Chastain', 'Ben Affleck', 'Casey Affleck'],
          crew: {
            cinematographer: 'Dariusz Wolski',
            editor: 'Pietro Scalia',
            production_designer: 'Arthur Max'
          },
          locations: ['Morocco', 'Jordan', 'Dubai'],
          created_at: new Date()
        },
        {
          _id: '8',
          title: 'The Art of War',
          poster: 'https://via.placeholder.com/300x450/991b1b/ffffff?text=The+Art+of+War',
          director: 'Ang Lee',
          producer: 'James Schamus',
          singer: 'Tan Dun',
          hero: 'Tony Leung',
          heroine: 'Zhang Ziyi',
          genre: 'Action/Drama',
          language: 'Mandarin/English',
          duration: '2h 10m',
          release_date: '2024-08-30',
          description: 'A martial arts epic set in ancient China, following the journey of a warrior seeking redemption.',
          total_amount: 13000000.00,
          invested_amount: 5000000.00,
          stock_price: 130.00,
          creator_id: '2',
          status: 'Pre-Production',
          budget_breakdown: {
            production: 7000000,
            marketing: 4000000,
            distribution: 1500000,
            contingency: 500000
          },
          cast: ['Tony Leung', 'Zhang Ziyi', 'Jet Li', 'Michelle Yeoh'],
          crew: {
            cinematographer: 'Peter Pau',
            editor: 'Tim Squyres',
            production_designer: 'Tim Yip'
          },
          locations: ['China', 'Hong Kong', 'Thailand'],
          created_at: new Date()
        },
        {
          _id: '9',
          title: 'Neon Dreams',
          poster: 'https://via.placeholder.com/300x450/701a75/ffffff?text=Neon+Dreams',
          director: 'Nicolas Winding Refn',
          producer: 'Marc Platt',
          singer: 'Cliff Martinez',
          hero: 'Ryan Gosling',
          heroine: 'Carey Mulligan',
          genre: 'Neo-Noir/Thriller',
          language: 'English',
          duration: '1h 55m',
          release_date: '2024-10-25',
          description: 'A stylish neo-noir thriller about a stunt driver who moonlights as a getaway driver.',
          total_amount: 11000000.00,
          invested_amount: 8000000.00,
          stock_price: 110.00,
          creator_id: '2',
          status: 'Post-Production',
          budget_breakdown: {
            production: 6000000,
            marketing: 3000000,
            distribution: 1500000,
            contingency: 500000
          },
          cast: ['Ryan Gosling', 'Carey Mulligan', 'Bryan Cranston', 'Albert Brooks'],
          crew: {
            cinematographer: 'Newton Thomas Sigel',
            editor: 'Mat Newman',
            production_designer: 'Beth Mickle'
          },
          locations: ['Los Angeles', 'Las Vegas', 'Death Valley'],
          created_at: new Date()
        },
        {
          _id: '10',
          title: 'The Last Frontier',
          poster: 'https://via.placeholder.com/300x450/1e3a8a/ffffff?text=The+Last+Frontier',
          director: 'Alejandro González Iñárritu',
          producer: 'Steve Golin',
          singer: 'Ryuichi Sakamoto',
          hero: 'Leonardo DiCaprio',
          heroine: 'Tom Hardy',
          genre: 'Adventure/Drama',
          language: 'English',
          duration: '2h 35m',
          release_date: '2024-12-15',
          description: 'A survival drama about a frontiersman seeking revenge in the harsh wilderness of 1820s America.',
          total_amount: 17000000.00,
          invested_amount: 9000000.00,
          stock_price: 170.00,
          creator_id: '2',
          status: 'In Production',
          budget_breakdown: {
            production: 10000000,
            marketing: 4000000,
            distribution: 2000000,
            contingency: 1000000
          },
          cast: ['Leonardo DiCaprio', 'Tom Hardy', 'Domhnall Gleeson', 'Will Poulter'],
          crew: {
            cinematographer: 'Emmanuel Lubezki',
            editor: 'Stephen Mirrione',
            production_designer: 'Jack Fisk'
          },
          locations: ['Alberta', 'Montana', 'Wyoming'],
          created_at: new Date()
        }
      ]);
      
      // Insert sample investments
      await db.collection('investments').insertMany([
        {
          _id: '1',
          movie_id: '1',
          investor_id: '1',
          total_amount: 15000.00,
          stock_count: 100,
          stock_price: 150.00,
          payment_status: 'completed',
          payment_method: 'bank_transfer',
          created_at: new Date()
        },
        {
          _id: '2',
          movie_id: '2',
          investor_id: '1',
          total_amount: 20000.00,
          stock_count: 100,
          stock_price: 200.00,
          payment_status: 'completed',
          payment_method: 'upi',
          created_at: new Date()
        },
        {
          _id: '3',
          movie_id: '3',
          investor_id: '1',
          total_amount: 18000.00,
          stock_count: 100,
          stock_price: 180.00,
          payment_status: 'pending',
          payment_method: null,
          created_at: new Date()
        }
      ]);

      // Insert sample notifications
      await db.collection('notifications').insertMany([
        {
          _id: '1',
          user_id: '2',
          message: 'New investment received for "The Last Adventure" - $15,000',
          type: 'investment',
          read: false,
          created_at: new Date()
        },
        {
          _id: '2',
          user_id: '2',
          message: 'Investment goal reached for "Mystery of the Deep"',
          type: 'milestone',
          read: false,
          created_at: new Date()
        },
        {
          _id: '3',
          user_id: '2',
          message: 'New investor registered for your project "Future City"',
          type: 'user',
          read: true,
          created_at: new Date()
        },
        {
          _id: '4',
          user_id: '1',
          message: 'Your investment in "The Last Adventure" has been confirmed',
          type: 'investment',
          read: false,
          created_at: new Date()
        },
        {
          _id: '5',
          user_id: '1',
          message: 'Payment completed for "Mystery of the Deep" investment',
          type: 'payment',
          read: false,
          created_at: new Date()
        }
      ]);
      
      console.log('Sample data inserted successfully');
    } else {
      console.log('Database already contains data, skipping sample data insertion');
    }
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// API Routes

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// User signup
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      _id: Date.now().toString(),
      username,
      email,
      password,
      role,
      created_at: new Date()
    };
    
    await db.collection('users').insertOne(newUser);
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: 'Failed to create user' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await db.collection('users').findOne({ username, password });
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Failed to authenticate' });
  }
});

// Get all movies
app.get('/api/movies', async (req, res) => {
  try {
    const { creatorId } = req.query;
    let query = {};
    
    if (creatorId) {
      query.creator_id = creatorId;
    }
    
    const movies = await db.collection('movies').find(query).toArray();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Add new movie
app.post('/api/movies', async (req, res) => {
  try {
    const movieData = {
      _id: Date.now().toString(),
      ...req.body,
      created_at: new Date()
    };
    
    const result = await db.collection('movies').insertOne(movieData);
    res.json(movieData);
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Update movie
app.put('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await db.collection('movies').updateOne(
      { _id: id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// Get all investments
app.get('/api/investments', async (req, res) => {
  try {
    const { investorId, creatorId } = req.query;
    let query = {};
    
    if (investorId) {
      query.investor_id = investorId;
    }
    
    if (creatorId) {
      // Get investments for movies created by this creator
      const movies = await db.collection('movies').find({ creator_id: creatorId }).toArray();
      const movieIds = movies.map(m => m._id);
      query.movie_id = { $in: movieIds };
    }
    
    const investments = await db.collection('investments').find(query).toArray();
    res.json(investments);
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

// Get specific investment
app.get('/api/investments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const investment = await db.collection('investments').findOne({ _id: id });
    
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    res.json(investment);
  } catch (error) {
    console.error('Error fetching investment:', error);
    res.status(500).json({ error: 'Failed to fetch investment' });
  }
});

// Create new investment
app.post('/api/investments', async (req, res) => {
  try {
    const investmentData = {
      _id: Date.now().toString(),
      ...req.body,
      created_at: new Date()
    };
    
    const result = await db.collection('investments').insertOne(investmentData);
    
    // Update movie invested amount
    const movie = await db.collection('movies').findOne({ _id: investmentData.movie_id });
    if (movie) {
      await db.collection('movies').updateOne(
        { _id: investmentData.movie_id },
        { $inc: { invested_amount: investmentData.total_amount } }
      );
    }
    
    res.json(investmentData);
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({ error: 'Failed to create investment' });
  }
});

// Complete payment
app.post('/api/investments/:id/complete-payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method } = req.body;
    
    // Update investment with payment status
    await db.collection('investments').updateOne(
      { _id: id },
      { $set: { payment_status: 'completed', payment_method, updated_at: new Date() } }
    );
    
    res.json({ message: 'Payment completed successfully' });
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).json({ error: 'Failed to complete payment' });
  }
});

// Get notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    
    if (userId) {
      query.user_id = userId;
    }
    
    const notifications = await db.collection('notifications').find(query).toArray();
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await closeConnection();
  process.exit(0);
});

// Start server
async function startServer() {
  await testConnection();
  await initializeDatabase();
  await insertSampleData();
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Test the API: http://localhost:${port}/api/test`);
  });
}

startServer().catch(console.error); 