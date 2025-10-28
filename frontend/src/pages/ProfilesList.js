import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom';

function ProfileCard({ profile, onDelete }){
  return (
    <div style={{border:'1px solid #eee', padding:12, borderRadius:8, width:280}}>
      <img src={profile.hero?.imageUrl || 'https://via.placeholder.com/300'} alt="" style={{width:'100%', height:150, objectFit:'cover', borderRadius:6}} />
      <h3>{profile.hero?.name}</h3>
      <p style={{fontStyle:'italic'}}>{profile.hero?.title}</p>
      <p style={{height:48, overflow:'hidden'}}>{profile.about?.bio}</p>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <Link to={`/portfolio/${profile.id}`}><button>View Portfolio</button></Link>
        <Link to={`/profiles/edit/${profile.id}`}><button>Edit</button></Link>
        <button onClick={() => onDelete(profile.id)}>Delete</button>
      </div>
      <div style={{marginTop:8}}>
        {profile.skills?.slice(0,6).map((s,i)=> <span key={i} style={{display:'inline-block', marginRight:6, padding:'4px 8px', background:'#f5f5f5', borderRadius:12}}>{s}</span>)}
      </div>
    </div>
  );
}

export default function ProfilesList(){
  const [profiles, setProfiles] = useState([]);
  const [q, setQ] = useState('');
  const nav = useNavigate();

  useEffect(()=> load(), []);

  async function load(){
    const res = await API.get('/profiles');
    setProfiles(res.data);
  }

  async function handleDelete(id){
    if(!window.confirm('Delete profile?')) return;
    await API.delete(`/profiles/${id}`);
    load();
  }

  function handleSearch(e){
    e.preventDefault();
    API.get('/profiles', { params: { q } }).then(res => setProfiles(res.data));
  }

  return (
    <div>
      <h2>Profiles</h2>
      <form onSubmit={handleSearch} style={{marginBottom:12}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or bio" />
        <button type="submit">Search</button>
        <button type="button" onClick={load} style={{marginLeft:8}}>Reset</button>
      </form>

      <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
        {profiles.map(p => <ProfileCard key={p.id} profile={p} onDelete={handleDelete} />)}
      </div>
    </div>
  );
}
