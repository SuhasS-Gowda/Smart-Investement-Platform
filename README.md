# Smart Investment Platform

A modern investment platform for movie projects built with React, Node.js, and MongoDB.

## Features

- User authentication (Investors and Creators)
- Movie project management
- Investment tracking
- Payment processing
- Real-time data visualization

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smart-Investment-Platform-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**

   **Option A: Local MongoDB Installation**
   - Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Start MongoDB service
   - The application will connect to `mongodb://localhost:27017` by default

   **Option B: MongoDB Atlas (Cloud)**
   - Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Set the environment variable:
     ```bash
     export MONGODB_URI="your-mongodb-atlas-connection-string"
     ```

4. **Start the development server**
   ```bash
   # Terminal 1: Start the backend server
   npm run server

   # Terminal 2: Start the frontend development server
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Database Schema

### Collections

1. **users**
   - `_id`: String (unique identifier)
   - `username`: String (unique)
   - `email`: String (unique)
   - `password`: String
   - `role`: String ('investor' or 'creator')
   - `created_at`: Date

2. **movies**
   - `_id`: String (unique identifier)
   - `title`: String
   - `poster`: String (URL)
   - `director`: String
   - `producer`: String
   - `singer`: String
   - `hero`: String
   - `heroine`: String
   - `total_amount`: Number
   - `invested_amount`: Number
   - `stock_price`: Number
   - `creator_id`: String (references users._id)
   - `created_at`: Date

3. **investments**
   - `_id`: String (unique identifier)
   - `movie_id`: String (references movies._id)
   - `investor_id`: String (references users._id)
   - `total_amount`: Number
   - `stock_count`: Number
   - `stock_price`: Number
   - `payment_status`: String ('pending', 'completed', 'failed')
   - `payment_method`: String
   - `created_at`: Date
   - `updated_at`: Date

## API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login

### Movies
- `GET /api/movies` - Get all movies (optional: filter by creator_id)
- `GET /api/movies/:id` - Get specific movie
- `POST /api/movies` - Create new movie
- `PUT /api/movies/:id` - Update movie

### Investments
- `GET /api/investments` - Get investments (optional: filter by creator_id or investor_id)
- `GET /api/investments/:id` - Get specific investment
- `POST /api/investments` - Create new investment
- `POST /api/investments/:id/complete-payment` - Complete payment for investment

## Environment Variables

- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017)
- `PORT`: Server port (default: 3001)

## Sample Data

The application automatically creates sample data on first run:
- 2 users (1 investor, 1 creator)
- 3 sample movies
- 2 sample investments

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Build Tool**: Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 