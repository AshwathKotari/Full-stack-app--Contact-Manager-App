// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [name, setName] = useState('');
  const [names, setNames] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = async () => {
    try {
      const response = await axios.get('http://localhost:5003/api/users');
      setNames(response.data);
    } catch (error) {
      console.error('Error fetching names:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5003/api/users/${editingId}`, { name });
        console.log('Name updated successfully');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5003/api/users', { name });
        console.log('Name added successfully');
      }
      setName('');
      fetchNames(); // Update the list of names after submission
    } catch (error) {
      console.error('Error sending name:', error);
    }
  };

  const handleEdit = (id, oldName) => {
    setEditingId(id);
    setName(oldName);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5003/api/users/${id}`);
      console.log('Name deleted successfully');
      fetchNames(); // Update the list of names after deletion
    } catch (error) {
      console.error('Error deleting name:', error);
    }
  };

  return (
    <div>
      <h1>Contact Manager</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button type="submit">{editingId ? 'Update' : 'Submit'}</button>
      </form>
      <h2>Contacts:</h2>
      <ul>
        {names.map((name) => (
          <li className='listitems' key={name._id}>
            <div className='listitemsnames-div'>
            {name.name}
            </div>
            <button onClick={() => handleEdit(name._id, name.name)}>Edit</button>
            <button onClick={() => handleDelete(name._id)}>Delete</button>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
