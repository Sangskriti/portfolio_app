import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPortfolio } from '../api';
import Template1Layout from '../components/Template1Layout';
import Template2Layout from '../components/Template2Layout';

export default function PortfolioPage(){
  const { id } = useParams();
  const [p, setP] = useState(null);
  useEffect(()=> {
    (async ()=>{
      try {
        const data = await fetchPortfolio(id);
        setP(data);
      } catch(err){
        console.error(err);
      }
    })();
  }, [id]);

  if (!p) return <div className="card">Loading...</div>;
  if (p.template === 'template1') return <Template1Layout data={p} />;
  return <Template2Layout data={p} />;
}
