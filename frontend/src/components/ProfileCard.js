import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfileCard({ profile }) {
  return (
    <div className="profile-card card">
      <img src={profile.profileImage || 'https://i.imgur.com/6VBx3io.png'} alt={profile.name}/>
      <h3>{profile.name}</h3>
      <div style={{color:'#666'}}>{profile.title}</div>
      <p style={{fontSize:14,color:'#444',marginTop:8}}>{profile.bio?.slice(0,120)}</p>

      <div style={{marginTop:8}}>
        {(profile.skills||[]).slice(0,5).map((s,idx)=>(<span key={idx} className="small-tag">{s}</span>))}
      </div>

      <div style={{marginTop:12}}>
        <Link className="btn" to={`/portfolio/${profile.id}`}>View Portfolio</Link>
      </div>
    </div>
  );
}
