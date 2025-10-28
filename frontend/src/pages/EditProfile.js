import React, { useEffect, useState } from 'react';
import API from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditProfile(){
  const { id } = useParams();
  const [data, setData] = useState(null);
  const nav = useNavigate();

  useEffect(()=> {
    API.get(`/profiles/${id}`).then(r=> setData(r.data)).catch(()=> alert('Not found'));
  }, [id]);

  function update(path, value){
    setData(prev=>{
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let cur = copy;
      for(let i=0;i<keys.length-1;i++) cur = cur[keys[i]];
      cur[keys[keys.length-1]] = value;
      return copy;
    });
  }

  async function save(){
    await API.put(`/profiles/${id}`, data);
    alert('Saved');
    nav('/profiles');
  }

  if(!data) return <div>Loading...</div>;
  return (
    <div>
      <h2>Edit {data.hero?.name}</h2>
      <input value={data.hero.name} onChange={e=>update('hero.name', e.target.value)} />
      <input value={data.hero.title} onChange={e=>update('hero.title', e.target.value)} />
      <textarea value={data.about.bio} onChange={e=>update('about.bio', e.target.value)} />
      <div style={{marginTop:8}}>
        <button onClick={save}>Save</button>
        <button onClick={()=>nav('/profiles')}>Cancel</button>
      </div>
    </div>
  );
}
