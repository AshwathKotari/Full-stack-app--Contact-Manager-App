// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
 const cors =require( "cors");

const app = express();
const PORT = process.env.PORT || 5003;
app.use(cors())

// Connect to MongoDB
mongoose.connect('mongodb+srv://ash:ash@cluster0.rg0vhlk.mongodb.net/names?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(console.log("successful"));

// Define user schema and model
const userSchema = new mongoose.Schema({
  name: String,
  
});
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Route to handle user name submission
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    const newUser = new User({ name });
    await newUser.save();
    res.status(201).json({ message: 'Name saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving name', error });
  }
});

// Route to get all names
app.get('/api/users', async (req,res)=>{
    try {
        const names = await User.find();
        res.json(names);
    } catch (error) {
        res.status(500).json({message : 'Error reterieving names',error})
    }
})

// Route to delete a name by id
app.delete('/api/users/:id', async(req,res)=>{
    try {
        const {id} =req.params;
        await User.findByIdAndDelete(id);
        res.json({message: 'Name deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Error deleting name', error });

    }
})

// Route to update a name by ID
app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await User.findByIdAndUpdate(id, { name });
      res.json({ message: 'Name updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating name', error });
    }
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
