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

  const handleDelete = async (id)=>{
    try{
      await axios.delete("http://localhost:8800/note/"+id)
      window.location.reload()
    }catch(err){
      console.log(err)
    }
  }

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
            <button className='delete' onClick={()=>handleDelete(item.idNote)}>Delete</button>
            <button className='Update'>
              <Link to={`/update/${item.idNote}`}>Update</Link>
            </button>
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
