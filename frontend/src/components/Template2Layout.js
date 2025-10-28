import React from 'react';

export default function Template2Layout({ data }) {
  return (
    <div>
      <section className="card hero-split" style={{marginBottom:18}}>
        <div style={{flex:'0 0 220px'}}>
          <img src={data.profileImage} alt="" style={{width:200,height:200,objectFit:'cover',borderRadius:12}}/>
        </div>
        <div>
          <h1 style={{margin:0}}>{data.name}</h1>
          <h3 style={{color:'#666',marginTop:6}}>{data.title}</h3>
          <p style={{marginTop:10}}>{data.tagline}</p>
          <div style={{marginTop:12,color:'#333'}}>Contact: {data.email} • {data.phone}</div>
        </div>
      </section>

      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:12}}>
        <div>
          <section className="card" style={{marginBottom:12}}>
            <h3>Work / Projects</h3>
            {(data.projects||[]).map((pr,idx)=>(
              <div key={idx} style={{display:'flex',gap:12,marginBottom:12}}>
                {pr.image && <img src={pr.image} alt="" style={{width:120,height:80,objectFit:'cover',borderRadius:8}}/>}
                <div>
                  <h4 style={{margin:0}}>{pr.title}</h4>
                  <p style={{marginTop:6}}>{pr.desc}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="card" style={{marginBottom:12}}>
            <h3>Testimonials</h3>
            {(data.testimonials||[]).map((t,i)=>(
              <div key={i} style={{padding:8,borderLeft:'3px solid #ffd94a', marginBottom:8}}>
                <strong>{t.name}</strong><p style={{margin:4}}>{t.quote}</p>
              </div>
            ))}
          </section>
        </div>

        <aside>
          <section className="card" style={{marginBottom:12}}>
            <h4>Skills</h4>
            <div>
              {(data.skills||[]).map((s,idx)=>(<div key={idx} className="small-tag" style={{display:'inline-block',marginRight:6}}>{s}</div>))}
            </div>
          </section>

          <section className="card" style={{marginBottom:12}}>
            <h4>Services</h4>
            <ul>
              {(data.services||[]).map((s,idx)=>(
                <li key={idx}><strong>{s.title}:</strong> {s.desc}</li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h4>Contact</h4>
            <p>{data.contact?.message}</p>
            <p><strong>Email</strong>: {data.contact?.email}</p>
            <p><strong>Phone</strong>: {data.contact?.phone}</p>
          </section>
        </aside>
      </div>

      <footer style={{textAlign:'center',padding:18,color:'#777',marginTop:12}}>Template 2 — Dynamic Portfolio</footer>
    </div>
  );
}
