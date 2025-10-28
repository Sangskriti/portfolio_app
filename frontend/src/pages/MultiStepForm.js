import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPortfolio, updatePortfolio, fetchPortfolio } from '../api';
import { v4 as uuidv4 } from 'uuid';

const empty = {
  template: 'template1',
  // Hero
  name: '',
  title: '',
  tagline: '',
  profileImage: '',
  // About
  bio: '',
  email: '',
  phone: '',
  location: '',
  socials: { twitter:'', linkedin:'', website:'' },
  // Skills
  skills: [],
  // Services (3)
  services: [{ id: uuidv4(), title:'', desc:'' },{ id: uuidv4(), title:'', desc:'' },{ id: uuidv4(), title:'', desc:'' }],
  // Portfolio (3)
  projects: [{ id: uuidv4(), title:'', image:'', desc:'' },{ id: uuidv4(), title:'', image:'', desc:'' },{ id: uuidv4(), title:'', image:'', desc:'' }],
  // Testimonials
  testimonials: [{ id: uuidv4(), name:'', quote:'' }],
  // Blog (optional)
  blog: { title:'', summary:'' },
  // Contact message
  contact: { message:'', email:'', phone:'' }
};

function readFileAsDataURL(file) {
  return new Promise((res, rej)=>{
    const fr = new FileReader();
    fr.onload = ()=>res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

export default function MultiStepForm(){
  const nav = useNavigate();
  const { template } = useParams();
  const [data, setData] = useState({...empty, template: template || 'template1'});
  const [step, setStep] = useState(0);
  const steps = ['Basic', 'About', 'Skills', 'Services', 'Portfolio', 'Testimonials', 'Blog', 'Contact'];

  useEffect(()=> {
    if (template) setData(d => ({...d, template}));
  }, [template]);

  const handleImage = async (e, fieldPath) => {
    const f = e.target.files[0];
    if (!f) return;
    const b64 = await readFileAsDataURL(f);
    setData(d => {
      const copy = {...d};
      // support for profileImage or project image via "projects[index].image"
      const pathParts = fieldPath.split('.');
      if (pathParts.length===1) copy[fieldPath] = b64;
      else if (pathParts[0] === 'projects') {
        const idx = parseInt(pathParts[1],10);
        copy.projects[idx].image = b64;
      }
      return copy;
    });
  };

  const addSkill = (txt) => {
    if(!txt) return;
    setData(d => ({...d, skills: [...d.skills, txt]}));
  };
  const removeSkill = (i) => setData(d => ({...d, skills: d.skills.filter((_,idx)=>idx!==i)}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await createPortfolio(data);
      alert('Profile created!');
      nav(`/portfolio/${created.id}`);
    } catch(err){
      console.error(err);
      alert('Error creating profile');
    }
  };

  const handleSaveEdit = async () => {
    // used to update if editing existing (not implemented full edit flow UI)
    if (!data.id) { alert('No id'); return; }
    try {
      await updatePortfolio(data.id, data);
      alert('Updated');
    } catch(err){ console.error(err); alert('Error updating'); }
  };

  return (
    <div>
      <h2>Create your portfolio</h2>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        {steps.map((s,i)=>(
          <div key={s} style={{padding:'6px 10px', borderRadius:8, background: i===step ? '#ffefc1' : '#fff', border:'1px solid #eee'}}>{s}</div>
        ))}
      </div>

      <form className="card" onSubmit={handleSubmit}>
        {/* Step 0: Basic */}
        {step === 0 && (
          <>
            <div className="form-row">
              <label>Template</label>
              <select value={data.template} onChange={e=>setData({...data, template:e.target.value})} className="input">
                <option value="template1">Template 1 (Yellow)</option>
                <option value="template2">Template 2 (Split)</option>
              </select>
            </div>
            <div className="form-row">
              <label>Name</label>
              <input className="input" value={data.name} onChange={e=>setData({...data, name:e.target.value})} />
            </div>
            <div className="form-row">
              <label>Title / Role</label>
              <input className="input" value={data.title} onChange={e=>setData({...data, title:e.target.value})} />
            </div>
            <div className="form-row">
              <label>Tagline</label>
              <input className="input" value={data.tagline} onChange={e=>setData({...data, tagline:e.target.value})} />
            </div>
            <div className="form-row">
              <label>Profile Image</label>
              <input type="file" accept="image/*" onChange={(e)=>handleImage(e,'profileImage')} />
              {data.profileImage && <img src={data.profileImage} alt="preview" style={{width:120,marginTop:8,borderRadius:8}}/>}
            </div>
          </>
        )}

        {/* Step 1: About */}
        {step === 1 && (
          <>
            <div className="form-row">
              <label>Bio</label>
              <textarea rows="4" value={data.bio} onChange={e=>setData({...data, bio:e.target.value})} className="input"/>
            </div>
            <div className="form-row">
              <label>Email</label>
              <input className="input" value={data.email} onChange={e=>setData({...data, email:e.target.value})} />
            </div>
            <div className="form-row">
              <label>Phone</label>
              <input className="input" value={data.phone} onChange={e=>setData({...data, phone:e.target.value})} />
            </div>
            <div className="form-row">
              <label>Location</label>
              <input className="input" value={data.location} onChange={e=>setData({...data, location:e.target.value})} />
            </div>
            <div className="form-row">
              <label>Socials (comma separated twitter, linkedin, website)</label>
              <input className="input" defaultValue={`${data.socials.twitter},${data.socials.linkedin},${data.socials.website}`} onBlur={e=>{
                const [t,l,w] = e.target.value.split(',').map(x=>x?.trim()||'');
                setData(d=>({...d, socials:{...d.socials, twitter:t, linkedin:l, website:w}}));
              }} />
            </div>
          </>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <>
            <div className="form-row">
              <label>Skills</label>
              <div style={{display:'flex',gap:8}}>
                <input id="newSkill" className="input" placeholder="Type skill and press Add" />
                <button type="button" className="btn" onClick={()=>{
                  const el = document.getElementById('newSkill');
                  addSkill(el.value);
                  el.value='';
                }}>Add</button>
              </div>
              <div style={{marginTop:10}}>
                {(data.skills||[]).map((s,i)=>(
                  <span key={i} className="small-tag">
                    {s} <button style={{marginLeft:6}} onClick={()=>removeSkill(i)}>x</button>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 3: Services */}
        {step === 3 && (
          <>
            <label>Services (3)</label>
            {data.services.map((sv,i)=>(
              <div key={sv.id} style={{marginBottom:8}}>
                <input className="input" placeholder="Title" value={sv.title} onChange={e=>{
                  const arr = [...data.services]; arr[i].title = e.target.value; setData({...data, services:arr});
                }} />
                <textarea rows="2" className="input" style={{marginTop:6}} placeholder="Description" value={sv.desc} onChange={e=>{
                  const arr = [...data.services]; arr[i].desc = e.target.value; setData({...data, services:arr});
                }} />
              </div>
            ))}
          </>
        )}

        {/* Step 4: Portfolio */}
        {step === 4 && (
          <>
            <label>Projects (3)</label>
            {data.projects.map((p,i)=>(
              <div key={p.id} style={{marginBottom:12}}>
                <input className="input" placeholder="Project Title" value={p.title} onChange={e=>{
                  const arr = [...data.projects]; arr[i].title = e.target.value; setData({...data, projects:arr});
                }}/>
                <input type="file" accept="image/*" onChange={(e)=> {
                  (async ()=>{
                    const fr = new FileReader();
                    fr.onload = ()=> {
                      const arr = [...data.projects];
                      arr[i].image = fr.result;
                      setData({...data, projects:arr});
                    };
                    fr.readAsDataURL(e.target.files[0]);
                  })();
                }} style={{marginTop:6}} />
                {p.image && <img src={p.image} alt="proj" style={{width:140,marginTop:8,borderRadius:8}}/>}
                <textarea rows="2" className="input" placeholder="Description" style={{marginTop:6}} value={p.desc} onChange={e=>{
                  const arr = [...data.projects]; arr[i].desc = e.target.value; setData({...data, projects:arr});
                }} />
              </div>
            ))}
          </>
        )}

        {/* Step 5: Testimonials */}
        {step === 5 && (
          <>
            <label>Testimonials (1-3)</label>
            {data.testimonials.map((t,i)=>(
              <div key={t.id} style={{marginBottom:8}}>
                <input className="input" placeholder="Client name" value={t.name} onChange={e=>{
                  const arr = [...data.testimonials]; arr[i].name = e.target.value; setData({...data, testimonials:arr});
                }} />
                <textarea rows="2" className="input" style={{marginTop:6}} placeholder="Quote" value={t.quote} onChange={e=>{
                  const arr = [...data.testimonials]; arr[i].quote = e.target.value; setData({...data, testimonials:arr});
                }} />
              </div>
            ))}
            <div style={{marginTop:6}}>
              <button type="button" className="btn" onClick={()=>setData(d=>({...d, testimonials:[...d.testimonials, {id:uuidv4(), name:'', quote:''}]}))}>Add testimonial</button>
            </div>
          </>
        )}

        {/* Step 6: Blog */}
        {step === 6 && (
          <>
            <label>Blog (optional)</label>
            <input className="input" placeholder="Title" value={data.blog.title} onChange={e=>setData({...data, blog:{...data.blog, title:e.target.value}})} />
            <textarea className="input" rows="3" placeholder="Summary" value={data.blog.summary} onChange={e=>setData({...data, blog:{...data.blog, summary:e.target.value}})} />
          </>
        )}

        {/* Step 7: Contact */}
        {step === 7 && (
          <>
            <label>Contact message (for contact section)</label>
            <textarea className="input" rows="3" value={data.contact.message} onChange={e=>setData({...data, contact:{...data.contact, message:e.target.value}})} />
            <div style={{display:'flex',gap:8, marginTop:8}}>
              <input className="input" value={data.contact.email} placeholder="Contact email" onChange={e=>setData({...data, contact:{...data.contact, email:e.target.value}})} />
              <input className="input" value={data.contact.phone} placeholder="Contact phone" onChange={e=>setData({...data, contact:{...data.contact, phone:e.target.value}})} />
            </div>
          </>
        )}

        <div style={{display:'flex', justifyContent:'space-between', marginTop:16}}>
          <div>
            {step>0 && <button type="button" className="btn" onClick={()=>setStep(step-1)} style={{background:'#ccc', color:'#111'}}>Back</button>}
          </div>
          <div>
            {step < steps.length-1 && <button type="button" className="btn" onClick={()=>setStep(step+1)} style={{marginRight:8}}>Next</button>}
            {step === steps.length-1 ? (
              <button className="btn" type="submit">Create Portfolio</button>
            ) : (
              <button type="button" className="btn" onClick={()=> {
                // quick save draft to API (optional)
                alert('Continue to next steps or press Create at final step.');
              }}>Save draft</button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
