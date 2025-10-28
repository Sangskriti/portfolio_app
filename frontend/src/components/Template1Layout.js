import React from 'react';

export default function Template1Layout({ data }) {
  return (
    <div>
      <section className="hero-yellow card" style={{marginBottom:18}}>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          <img src={data.profileImage} alt="" style={{width:120, height:120, borderRadius:12, objectFit:'cover', boxShadow:'0 6px 12px rgba(0,0,0,0.08)'}}/>
          <div>
            <h1 style={{margin:0}}>{data.name}</h1>
            <div style={{fontWeight:700}}>{data.title}</div>
            <div style={{marginTop:6,color:'#333'}}>{data.tagline}</div>
            <div style={{marginTop:8}}>{data.contact?.email}</div>
          </div>
        </div>
      </section>

      <section className="card" style={{marginBottom:12}}>
        <h3>About</h3>
        <p>{data.bio}</p>
        <div style={{color:'#666'}}>Location: {data.location}</div>
      </section>

      <section className="card" style={{marginBottom:12}}>
        <h3>Skills</h3>
        <div>{(data.skills||[]).map((s,i)=>(<span key={i} className="small-tag">{s}</span>))}</div>
      </section>

      <section className="card" style={{marginBottom:12}}>
        <h3>Services</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
          {(data.services||[]).map((s,idx)=>(
            <div key={idx} style={{background:'#fff6d6',padding:12,borderRadius:8}}>
              <h4>{s.title}</h4>
              <p style={{marginTop:6}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{marginBottom:12}}>
        <h3>Portfolio</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12}}>
          {(data.projects||[]).map((pr,idx)=>(
            <div key={idx} style={{background:'#fff',borderRadius:8,overflow:'hidden'}}>
              {pr.image && <img src={pr.image} alt={pr.title} style={{width:'100%',height:140,objectFit:'cover'}} />}
              <div style={{padding:12}}>
                <h4 style={{margin:0}}>{pr.title}</h4>
                <p style={{marginTop:8}}>{pr.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{marginBottom:12}}>
        <h3>Testimonials</h3>
        {(data.testimonials||[]).map((t,idx)=>(
          <blockquote key={idx} style={{margin:'12px 0'}}><strong>{t.name}:</strong> {t.quote}</blockquote>
        ))}
      </section>

      <section className="card" style={{marginBottom:12}}>
        <h3>Blog</h3>
        <h4>{data.blog?.title}</h4>
        <p>{data.blog?.summary}</p>
      </section>

      <section className="card" style={{marginBottom:12}}>
        <h3>Contact</h3>
        <p>{data.contact?.message}</p>
        <p><strong>Email:</strong> {data.contact?.email}</p>
        <p><strong>Phone:</strong> {data.contact?.phone}</p>
      </section>

      <footer style={{textAlign:'center',padding:18,color:'#777'}}>Generated with PortfolioGen</footer>
    </div>
  );
}
