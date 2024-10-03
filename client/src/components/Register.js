import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    nationalId: '',
    district: '',
    homeAddress: '',
    password: '',
  });

  const { fullName, username, email, phoneNumber, nationalId, district, homeAddress, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      console.log(res.data); // Handle success (store token, redirect, etc.)
    } catch (err) {
      console.error(err.response.data); // Handle errors
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="fullName" value={fullName} onChange={onChange} placeholder="Full Name" required />
      <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
      <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
      <input type="text" name="phoneNumber" value={phoneNumber} onChange={onChange} placeholder="Phone Number" required />
      <input type="text" name="nationalId" value={nationalId} onChange={onChange} placeholder="National ID" required />
      <input type="text" name="district" value={district} onChange={onChange} placeholder="District of Origin" required />
      <input type="text" name="homeAddress" value={homeAddress} onChange={onChange} placeholder="Home Address" required />
      <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;