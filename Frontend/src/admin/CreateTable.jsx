import React, { useState } from 'react';
import axios from 'axios';

function CreateTable() {

    const [tableName, setTableName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8800/api/adminwork/createTable', { tableName });
            alert(response.data);
        } catch (error) {
            console.error(error);
            alert('Error creating table');
        }
    };



  return (
    
    <form onSubmit={handleSubmit}>
    <div>
        <label>New Table Name: </label>
        <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            required
        />
    </div>
    <button type="submit">Create Table</button>
</form>
  )
}

export default CreateTable