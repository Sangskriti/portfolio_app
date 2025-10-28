import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const blank = {
  hero: { name:'', title:'', tagline:'', imageUrl:'' },
  about: { bio:'', email:'', phone:'', location:'', socials:'' },
  skills: [],
  services: [{title:'',description:''},{title:'',description:''},{title:'',description:''}],
  portfolio: [{title:'',imageUrl:'',description:''},{title:'',imageUrl:'',description:''},{title:'',imageUrl:'',description:''}],
  testimonials: [{client:'',quote:''}],
  blog: { title:'', summary:'' },
  contact: { messageText:'', email:'', phone:'' },
  template: localStorage.getItem('selectedTemplate') || 'template-1'
};

export default function CreateProfile(){
  const [data, setData] = useState(blank);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  useEffect(()=> {
    const sel = localStorage.getItem('selectedTemplate');
    if(sel) setData(d => ({...d, template: sel}));
  },[]);

  function update(path, value){
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let cur = copy;
      for(let i=0;i<keys.length-1;i++) cur = cur[keys[i]];
      cur[keys[keys.length-1]] = value;
      return copy;
    });
  }

  function addSkill(){
    if(!skillInput.trim()) return;
    setData(d => ({...d, skills: [...d.skills, skillInput.trim()]}));
    setSkillInput('');
  }
  function removeSkill(i){ setData(d => ({...d, skills: d.skills.filter((_, idx)=> idx!==i)})); }

  async function handleSubmit(e){
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/profiles', data);
      alert('Profile created!');
      nav('/profiles');
    } catch(err){
      console.error(err);
      alert('Failed to create');
    } finally { setSaving(false); }
  }

  return (
    <div>
      <h2>Create Profile (Template: {data.template})</h2>
      <form onSubmit={handleSubmit}>
        <section style={{marginBottom:18}}>
          <h3>Hero Section</h3>
          <input placeholder="Name" value={data.hero.name} onChange={e=>update('hero.name', e.target.value)} style={{display:'block',width:'100%',marginBottom:8}} />
          <input placeholder="Title / Role" value={data.hero.title} onChange={e=>update('hero.title', e.target.value)} style={{display:'block',width:'100%',marginBottom:8}} />
          <input placeholder="Tagline" value={data.hero.tagline} onChange={e=>update('hero.tagline', e.target.value)} style={{display:'block',width:'100%',marginBottom:8}} />
          <input placeholder="Profile Image URL" value={data.hero.imageUrl} onChange={e=>update('hero.imageUrl', e.target.value)} style={{display:'block',width:'100%'}} />
        </section>

        <section style={{marginBottom:18}}>
          <h3>About Me</h3>
          <textarea placeholder="Bio" value={data.about.bio} onChange={e=>update('about.bio', e.target.value)} style={{display:'block',width:'100%',height:80}} />
          <input placeholder="Email" value={data.about.email} onChange={e=>update('about.email', e.target.value)} style={{display:'block',width:'100%',marginTop:8}} />
          <input placeholder="Phone" value={data.about.phone} onChange={e=>update('about.phone', e.target.value)} style={{display:'block',width:'100%',marginTop:8}} />
          <input placeholder="Location" value={data.about.location} onChange={e=>update('about.location', e.target.value)} style={{display:'block',width:'100%',marginTop:8}} />
          <input placeholder="Socials (comma separated)" value={data.about.socials} onChange={e=>update('about.socials', e.target.value)} style={{display:'block',width:'100%',marginTop:8}} />
        </section>

        <section style={{marginBottom:18}}>
          <h3>Skills</h3>
          <div style={{display:'flex',gap:8}}>
            <input value={skillInput} onChange={e=>setSkillInput(e.target.value)} placeholder="type skill and click Add" style={{flex:1}} />
            <button type="button" onClick={addSkill}>Add</button>
          </div>
          <div style={{marginTop:8}}>
            {data.skills.map((s,i)=>(
              <span key={i} style={{display:'inline-block',padding:'6px 10px',background:'#eee',borderRadius:16, marginRight:6, marginTop:6}}>
                {s} <button type="button" onClick={()=>removeSkill(i)} style={{marginLeft:8}}>x</button>
              </span>
            ))}
          </div>
        </section>

        <section style={{marginBottom:18}}>
          <h3>Services (3)</h3>
          {data.services.map((svc,i)=>(
            <div key={i} style={{marginBottom:8}}>
              <input placeholder="Service title" value={svc.title} onChange={e=>{const next=[...data.services]; next[i].title=e.target.value; setData(d=>({...d, services: next}));}} style={{width:'100%', marginBottom:4}} />
              <input placeholder="Service description" value={svc.description} onChange={e=>{const next=[...data.services]; next[i].description=e.target.value; setData(d=>({...d, services: next}));}} style={{width:'100%'}} />
            </div>
          ))}
        </section>

        <section style={{marginBottom:18}}>
          <h3>Portfolio Projects (3)</h3>
          {data.portfolio.map((p,i)=>(
            <div key={i} style={{marginBottom:8}}>
              <input placeholder="Project title" value={p.title} onChange={e=>{const next=[...data.portfolio]; next[i].title=e.target.value; setData(d=>({...d, portfolio: next}));}} style={{width:'100%', marginBottom:4}} />
              <input placeholder="Project image URL" value={p.imageUrl} onChange={e=>{const next=[...data.portfolio]; next[i].imageUrl=e.target.value; setData(d=>({...d, portfolio: next}));}} style={{width:'100%', marginBottom:4}} />
              <textarea placeholder="Project description" value={p.description} onChange={e=>{const next=[...data.portfolio]; next[i].description=e.target.value; setData(d=>({...d, portfolio: next}));}} style={{width:'100%'}} />
            </div>
          ))}
        </section>

        <section style={{marginBottom:18}}>
          <h3>Testimonials (1–3)</h3>
          {data.testimonials.map((t,i)=>(
            <div key={i} style={{marginBottom:8}}>
              <input placeholder="Client name" value={t.client} onChange={e=>{const next=[...data.testimonials]; next[i].client=e.target.value; setData(d=>({...d, testimonials: next}));}} style={{width:'100%', marginBottom:4}} />
              <textarea placeholder="Quote" value={t.quote} onChange={e=>{const next=[...data.testimonials]; next[i].quote=e.target.value; setData(d=>({...d, testimonials: next}));}} style={{width:'100%'}} />
            </div>
          ))}
          <div>{data.testimonials.length<3 && <button type="button" onClick={()=>setData(d=>({...d, testimonials:[...d.testimonials, {client:'',quote:''}]}))}>Add Testimonial</button>}</div>
        </section>

        <section style={{marginBottom:18}}>
          <h3>Blog (optional)</h3>
          <input placeholder="Blog title" value={data.blog.title} onChange={e=>update('blog.title', e.target.value)} style={{display:'block',width:'100%',marginBottom:8}} />
          <textarea placeholder="Summary" value={data.blog.summary} onChange={e=>update('blog.summary', e.target.value)} style={{display:'block',width:'100%'}} />
        </section>

        <section style={{marginBottom:18}}>
          <h3>Contact Info</h3>
          <textarea placeholder="Message text" value={data.contact.messageText} onChange={e=>update('contact.messageText', e.target.value)} style={{display:'block',width:'100%',marginBottom:8}} />
          <input placeholder="Email" value={data.contact.email} onChange={e=>update('contact.email', e.target.value)} style={{display:'block',width:'100%',marginBottom:8}} />
          <input placeholder="Phone" value={data.contact.phone} onChange={e=>update('contact.phone', e.target.value)} style={{display:'block',width:'100%'}} />
        </section>

        <div style={{display:'flex', gap:12}}>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Submit & Create Profile'}</button>
          <button type="button" onClick={()=>{localStorage.setItem('selectedTemplate','template-1'); setData(d=>({...d, template:'template-1'}))}}>Use Template 1</button>
          <button type="button" onClick={()=>{localStorage.setItem('selectedTemplate','template-2'); setData(d=>({...d, template:'template-2'}))}}>Use Template 2</button>
        </div>
      </form>
    </div>
  );
}
