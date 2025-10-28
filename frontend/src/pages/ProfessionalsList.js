import React, { useEffect, useState } from 'react';
import { fetchPortfolios } from '../api';
import ProfileCard from '../components/ProfileCard';

export default function ProfessionalsList(){
  const [items, setItems] = useState([]);
  const [skillFilter, setSkillFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const load = async () => {
    const data = await fetchPortfolios();
    setItems(data);
  };

  useEffect(()=>{ load(); }, []);

  const applyFilters = async () => {
    const params = {};
    if (skillFilter) params.skill = skillFilter;
    if (roleFilter) params.role = roleFilter;
    const data = await fetchPortfolios(params);
    setItems(data);
  };

  return (
    <div>
      <h2>Professionals</h2>
      <div className="card" style={{marginBottom:12}}>
        <div className="filter-row">
          <input placeholder="Filter by skill (e.g. React)" className="input" value={skillFilter} onChange={e=>setSkillFilter(e.target.value)} />
          <input placeholder="Filter by role (e.g. Engineer)" className="input" value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} />
          <button className="btn" onClick={applyFilters}>Apply</button>
          <button className="btn" style={{background:'#777'}} onClick={()=>{ setSkillFilter(''); setRoleFilter(''); load(); }}>Reset</button>
        </div>
      </div>

      <div className="profile-grid">
        {items.map(p => <ProfileCard key={p.id} profile={p} />)}
      </div>
    </div>
  );
}
