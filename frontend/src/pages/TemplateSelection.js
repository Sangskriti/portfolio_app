import React from 'react';
import { useNavigate } from 'react-router-dom';

const templates = [
  { id: 'template1', name: 'Template 1', subtitle: 'Yellow hero, clean single-column' , img: 'https://i.imgur.com/7KQ9g8G.jpg' },
  { id: 'template2', name: 'Template 2', subtitle: 'Split hero, timeline & masonry' , img: 'https://i.imgur.com/3vQvKqC.jpg' }
];

export default function TemplateSelection(){
  const nav = useNavigate();
  return (
    <div>
      <h1>Choose Your Template</h1>
      <div className="template-grid">
        {templates.map(t => (
          <div className="template-box card" key={t.id} onClick={()=>nav(`/create/${t.id}`)}>
            <img src={t.img} alt={t.name}/>
            <div className="meta">
              <h3>{t.name}</h3>
              <p style={{marginTop:4,color:'#666'}}>{t.subtitle}</p>
              <div style={{marginTop:10}}>
                <button className="btn">Use this template</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
