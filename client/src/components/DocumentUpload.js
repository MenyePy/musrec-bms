import React, { useState } from 'react';
import axios from 'axios';

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('document', file);
    formData.append('title', title);

    try {
      const res = await axios.post('/api/business/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded', res.data);
    } catch (err) {
      console.error('Error uploading file', err.response.data);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input type="file" onChange={onFileChange} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default DocumentUpload;
