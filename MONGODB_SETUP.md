# MongoDB Atlas Setup Guide

## 🔧 Setup Instructions

### 1. Get Your MongoDB Atlas Password
You need to replace `<db_password>` in the connection string with your actual MongoDB Atlas password.

**Your connection string is:**
```
mongodb+srv://singlepk22:<db_password>@funding.ukkltp7.mongodb.net/?retryWrites=true&w=majority&appName=funding
```

### 2. Update the Configuration
Edit `config/mongodb.js` and replace `<db_password>` with your actual password:

```javascript
const MONGODB_URI = "mongodb+srv://singlepk22:YOUR_ACTUAL_PASSWORD@funding.ukkltp7.mongodb.net/?retryWrites=true&w=majority&appName=funding";
```

### 3. Test MongoDB Connection
Before starting the server, test your connection:
```bash
npm run test-mongodb
```

### 4. Start the Backend Server
```bash
npm run server
```

### 5. Start the Frontend
In a new terminal:
```bash
npm run dev
```

## 🎬 Available Movies (10 Movies Added)

The database now includes 10 comprehensive movies with detailed information:

1. **The Last Adventure** - Action/Adventure ($15M budget)
2. **Mystery of the Deep** - Sci-Fi/Thriller ($20M budget)
3. **Future City** - Sci-Fi/Drama ($18M budget)
4. **The Lost Kingdom** - Fantasy/Adventure ($25M budget)
5. **Ocean's Legacy** - Crime/Comedy ($12M budget)
6. **The Quantum Effect** - Sci-Fi/Thriller ($16M budget)
7. **Desert Storm** - Action/Drama ($14M budget)
8. **The Art of War** - Action/Drama ($13M budget)
9. **Neon Dreams** - Neo-Noir/Thriller ($11M budget)
10. **The Last Frontier** - Adventure/Drama ($17M budget)

Each movie includes:
- Complete cast and crew information
- Budget breakdown
- Production status
- Release dates
- Genres and descriptions
- Filming locations

## 🚀 Quick Start (Alternative)

If you want to run without MongoDB for now, you can use the frontend-only version:

1. **Revert dataManager.ts to localStorage version**
2. **Run only the frontend:**
   ```bash
   npm run dev
   ```

## 🔍 Troubleshooting

### SSL/TLS Issues
If you get SSL errors, try these connection options in `config/mongodb.js`:

```javascript
client = new MongoClient(MONGODB_URI, {
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true, // Try this if SSL fails
  tlsAllowInvalidHostnames: true,    // Try this if SSL fails
  retryWrites: true,
  w: 'majority'
});
```

### Network Issues
- Make sure your IP is whitelisted in MongoDB Atlas
- Check if your firewall is blocking the connection
- Try using a different network

## 📝 Test Credentials
Once connected, you can use these test accounts:
- **Investor**: username: `investor1`, password: `password123`
- **Creator**: username: `creator1`, password: `password123` 