import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    cover: "",
    category: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/note", book);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  console.log(book);

  return (
    <div className='form'>
      <h1>Add New Note</h1>

      <input type="text" placeholder='title' name="title" onChange={handleChange} />
      <input type="text" placeholder='desc' name="desc" onChange={handleChange} />
      <input type="text" placeholder='cover' name="cover" onChange={handleChange} />
      <input type="text" placeholder='category' name="category" onChange={handleChange} />

      <button onClick={handleClick}>Add</button>
    </div>
  );
};

export default Add;
