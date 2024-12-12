// Importing the express module
const express = require('express');
const app = express();
const db = require('./config/db.config');
// Initialize the db connection
db.init();
// Initializing the data with the following string
var data = "Welcome to Kuexpress !"

const Role = require('./models/Role');  // Import the User model

const User = require('./models/User');  // Import the User model

User.associate({ Role, Post });

// Use the User model to create a new user and fetch users
async function main() {
  // Create a new user
  const newUser = await User.createUser('John Doe', 'johndoe@example.com');
  console.log('New User:', newUser);

  // Get all users
  const users = await User.getAllUsers();
  console.log('All Users:', users);

  // Get a user by email
  const user = await User.getUserByEmail('johndoe@example.com');
  console.log('User Found:', user);
}

main().catch((error) => console.error(error));


// Sending the response for '/' path
app.get('/' , (req,res)=>{

   // Sending the data json text
   res.send(data);
})

// Setting up the server at port 3000
app.listen(3000 , ()=>{
   console.log("server running");
});