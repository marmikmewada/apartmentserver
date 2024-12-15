const express = require('express');
const dotenv = require('dotenv');
const connectToDatabase = require('./db'); // Import the database connection
const loginRoutes = require('./routes/user/auth/login'); // Import login routes
const signupRoutes = require('./routes/user/auth/signup'); // Import signup routes
const getAllUsersRoutes = require('./routes/chairman/getalluser'); // Import the get all users route
const createUserRoutes = require('./routes/chairman/createuser'); // Import the create user route
const createguard = require("./routes/chairman/createguard")
const createapartment = require("./routes/chairman/createapartment")
const getallapartments = require("./routes/chairman/getallapartments")
const getallguards = require("./routes/chairman/getallguards")
const deleteapartment = require("./routes/chairman/deleteapartment")
const deleteguard = require("./routes/chairman/deleteguard")
const deleteuser = require("./routes/chairman/deleteuser")
const getallvisitors = require("./routes/owner/getallvisitors")
const getownerprofile = require("./routes/owner/getownerprofile")
const updateownerprofile = require("./routes/owner/updateownerprofile")


const guardLogin = require("./routes/guard/login")
const getallactivevisitors = require("./routes/guard/getallactivevisitors")
const doentry = require("./routes/guard/doentry")
const doexit = require("./routes/guard/doexit")
const guardgetallapartments = require("./routes/guard/getallapartments")


const { verifyToken, verifyRole } = require('./middleware/auth'); // Import the middleware
const { verifyGuardToken } = require('./middleware/guardAuth');


// Initialize dotenv to load environment variables from .env file
dotenv.config(); // Ensure this is at the top

// Initialize Express app
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for logging requests (Optional but useful)
app.use((req, res, next) => {
  console.log(`${req.method} request made to: ${req.url}`);
  next();
});

// Connect to the MongoDB database before starting the server
connectToDatabase()
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit if the connection fails
  });

// Set up a default route to check server status
app.get('/server', (req, res) => {
  res.send('Server is running!');
});

// Profile route: Accessible to any authenticated user
app.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'user profile',
    user: req.user, // This is the decoded user info from the token
  });
});

// Route only accessible to users with the 'chairman' role
app.get('/chairman-dashboard', verifyToken, verifyRole('chairman'), (req, res) => {
  res.json({
    message: 'This is the chairman dashboard',
    user: req.user,
  });
});

// Use the new route for fetching all users, only accessible by chairman
app.use('/chairman/getallusers', verifyToken, verifyRole('chairman'), getAllUsersRoutes); // Apply middleware here

// Use the new route for creating users, only accessible by chairman
app.use('/chairman/createuser', verifyToken, verifyRole('chairman'), createUserRoutes); // Apply middleware here
app.use('/chairman/createguard', verifyToken, verifyRole('chairman'), createguard); // Apply middleware here
app.use('/chairman/creatapartment', verifyToken, verifyRole('chairman'), createapartment); // Apply middleware here
app.use('/chairman/getallapartments', verifyToken, verifyRole('chairman'), getallapartments); // Apply middleware here
app.use('/chairman/getallguards', verifyToken, verifyRole('chairman'), getallguards);
app.use('/chairman/deleteapartment', verifyToken, verifyRole('chairman'), deleteapartment);
app.use('/chairman/deleteguard', verifyToken, verifyRole('chairman'), deleteguard);
app.use('/chairman/deleteuser', verifyToken, verifyRole('chairman'), deleteuser);

app.use('/owner/getallvisitors', verifyToken, getallvisitors);
app.use('/owner/getownerprofile', verifyToken, getownerprofile);
app.use('/owner/updateownerprofile', verifyToken, updateownerprofile);


app.use("/guard/login", verifyGuardToken, guardLogin);
app.use("/guard/getallactivevisitors", verifyGuardToken, getallactivevisitors);
app.use("/guard/getallvisitors", verifyGuardToken, getallvisitors);
app.use("/guard/doentry", verifyGuardToken, doentry);
app.use("/guard/doexit", verifyGuardToken, doexit);



// Use login and signup routes
app.use('/auth/login', loginRoutes); // Handle POST requests to /auth/login
app.use('/auth/signup', signupRoutes); // Handle POST requests to /auth/signup

// Start listening for incoming requests on the specified port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
