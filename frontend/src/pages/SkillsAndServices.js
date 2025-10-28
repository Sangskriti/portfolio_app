import React, { useEffect } from 'react';

const sampleData = {
  skills: [
    { title: 'Drone Training', subtitle: 'RPAS Instructor (DGCA)', items: [{name:'Ground School & Simulators', percent:95},{name:'Practical Flying Sessions', percent:82},{name:'Pre-Flight & Safety', percent:88}] },
    { title: 'Aerospace Expertise', subtitle:'Flight Dynamics & Stability', items:[{name:'CFD & Wind Tunnel Testing', percent:92},{name:'Flight Dynamics & Stability', percent:92},{name:'Curriculum Development', percent:86}] },
    { title: 'Professional Skills', subtitle:'Technical Writing & Research', items:[{name:'Technical Writing & Research', percent:94},{name:'Public Speaking', percent:89},{name:'Conference & Event Mgmt', percent:85}] }
  ],
  certifications: [
    { short:'DGCA', title:'DGCA RPAS Instructor', sub:'Medium & Small Class Certified' },
    { short:'Author', title:'Published Author', sub:'Publications on Propulsion & AI' },
    { short:'Org', title:'Conference Organizer', sub:'ICAS - 2019, Aeronautics & Safety' }
  ],
  services: [
    { icon:'🎓', title:'Drone Pilot Training', desc:'Comprehensive RPAS training programs.', bullets:['Ground School Modules','Simulated Flight Sessions','National Flight Records','DGCA Certification Support'] },
    { icon:'🛰️', title:'Aerospace Education', desc:'Avionics-focused instruction and projects.', bullets:['Flight Dynamics','Aeroelasticity','Wind Tunnel Testing','Curriculum Development'] },
    { icon:'✍️', title:'Research & Technical Writing', desc:'Authoring support and research consultations.', bullets:['Published Papers','Conference Papers','Data Analysis','Academic Review'] },
    { icon:'🛠️', title:'Workshops & Event Management', desc:'End-to-end event support.', bullets:['Event Planning','Faculty Training','Safety Procedures','Panel Arrangements'] }
  ]
};

function SkillCard({ card }){
  useEffect(()=> {
    const els = document.querySelectorAll('.skill-card .progress-bar');
    els.forEach(el => {
      const target = el.getAttribute('data-target');
      el.style.width = target + '%';
    });
  }, []);
  return (
    <div className="skill-card">
      <div className="title-row">
        <div className="icon">★</div>
        <div>
          <div style={{fontWeight:800}}>{card.title}</div>
          <div className="subtitle">{card.subtitle}</div>
        </div>
      </div>
      {card.items.map((it,i)=>(
        <div key={i} className="skill-item">
          <div className="label">{it.name}</div>
          <div className="progress-track" aria-hidden>
            <div className="progress-bar" data-target={it.percent} style={{width:'0%'}} />
          </div>
          <div className="percent">{it.percent}%</div>
        </div>
      ))}
    </div>
  );
}

export default function SkillsAndServices({ data }) {
  const { skills, certifications, services } = data || sampleData;
  return (
    <div className="section">
      <div className="skills-grid">{skills.map((s,i)=><SkillCard key={i} card={s} />)}</div>
      <div className="cert-strip">
        <h4>Certifications &amp; <span style={{color:'#ffd54d'}}>Achievements</span></h4>
        <div className="cert-list">{certifications.map((c,i)=>(<div className="cert-item" key={i}><div className="mini">{c.short}</div><div><div style={{fontWeight:700}}>{c.title}</div><div style={{fontSize:13,opacity:0.9}}>{c.sub}</div></div></div>))}</div>
      </div>
      <div>
        <h3 style={{textAlign:'center', marginBottom:12}}>My <span style={{color:'#ff3b30'}}>Services</span></h3>
        <p style={{textAlign:'center', color:'#666', marginBottom:18}}>Specialized drone and aerospace training programs tailored for individuals, institutions, and researchers.</p>
        <div className="services-grid">{services.map((svc,i)=>(<div className="service-card" key={i}><div className="service-top"><div className="service-icon">{svc.icon}</div><div className="service-title">{svc.title}</div></div><div className="service-desc">{svc.desc}</div><div className="service-bullets">{svc.bullets.map((b,bi)=>(<div className="bullet" key={bi}><div className="dot" /> <div>{b}</div></div>))}</div></div>))}</div>
      </div>
    </div>
  );
}
