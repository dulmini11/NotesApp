import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const res = await axios.get("http://localhost:8800/note");
        setNotes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllNotes();
  }, []);

  return (
    <div>
      <h1>Write a new note</h1>

      <div className='notes'>
        {notes.map(item => (
          <div className='note' key={item.id}>
            {item.cover && <img src={item.cover} alt="" />}
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
            <span>{item.category}</span>
          </div>
        ))}
      </div>

      <button>
        <Link to="/add">Add new Note</Link>
      </button>
    </div>
  );
};

export default Notes;
