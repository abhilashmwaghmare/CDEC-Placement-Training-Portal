(() => {
  const C = window.CLOUDBLITZ_CONTENT;
  if (!C) return;
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const sheets = Object.fromEntries((C.sheets || []).map(s => [s.name, s]));
  const names = ['Sample Resume — Fresher','Sample Resume — Experienced'];

  function rowsFor(name){ return (sheets[name]?.rows || []).filter(r => r && r.some(v => String(v ?? '').trim())); }
  function lines(row){ return row.filter(v => String(v ?? '').trim()).map(v => String(v).trim()); }
  function isHeading(t){ return /^\s*(PROFESSIONAL SUMMARY|INTERNSHIP EXPERIENCE|PROFESSIONAL EXPERIENCE|TECHNICAL SKILLS|EDUCATION|CERTIFICATIONS|PROJECTS|ACHIEVEMENTS|RESPONSIBILITIES|SKILLS|EXPERIENCE|OBJECTIVE|PROFESSIONAL PROFILE|CAREER SUMMARY)/i.test(t); }
  function sectionTitle(t){ return t.replace(/^\s+/, '').trim(); }
  function splitSections(rows){
    const sections=[]; let current=null;
    rows.slice(4).forEach(r=>{
      const v=lines(r); if(!v.length) return;
      const joined=v.join('   ');
      if(isHeading(joined)) { if(current) sections.push(current); current={title:sectionTitle(joined),items:[]}; return; }
      if(!current) current={title:'Profile',items:[]};
      current.items.push(v);
    });
    if(current) sections.push(current);
    return sections;
  }
  function contentHtml(section){
    return section.items.map(v=>{
      if(v.length>=3) return `<div class="cr-skill"><b>${esc(v[0])}</b><span>${esc(v.slice(1).join(' · '))}</span></div>`;
      const t=v.join('   ');
      const bullet=/^[▸•●]/.test(t);
      return `<div class="cr-line ${bullet?'bullet':''}">${esc(t)}</div>`;
    }).join('');
  }
  function visualResume(name){
    const rows=rowsFor(name); if(!rows.length) return '<div class="empty">Resume source not found.</div>';
    const title=lines(rows[0]).join(' ') || name;
    const person=lines(rows[1])[0] || 'Candidate';
    const role=lines(rows[2])[0] || '';
    const contact=lines(rows[3]).join(' | ');
    const sections=splitSections(rows);
    const experienced=name.includes('Experienced');
    const initials=person.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
    const side=sections.filter(s=>/SKILLS|CERTIFICATION|EDUCATION|ACHIEVEMENT|LANGUAGE/i.test(s.title));
    const main=sections.filter(s=>!side.includes(s));
    const renderSection=s=>`<section class="cr-section"><div class="cr-section-title"><span></span><h3>${esc(s.title)}</h3></div>${contentHtml(s)}</section>`;
    return `<div class="resume-canvas-wrap">
      <div class="resume-canvas-toolbar"><div><span class="cr-badge">CLOUDBLITZ</span><strong>${experienced?'Experienced Resume':'Fresher Resume'}</strong><small>Canva-style visual preview · source content preserved</small></div><div class="cr-actions"><button class="pill-btn" onclick="window.print()">Print / PDF</button><button class="pill-btn" onclick="show('resumes')">← Resume Library</button></div></div>
      <div class="resume-canvas ${experienced?'cr-experienced':'cr-fresher'}">
        <aside class="cr-sidebar"><div class="cr-orb"><span>${esc(initials)}</span></div><div class="cr-brand-mini">CB</div><div class="cr-side-label">PROFILE</div><div class="cr-side-role">${esc(role)}</div><div class="cr-side-line"></div><div class="cr-side-label">SOURCE</div><div class="cr-source">${esc(title)}</div><div class="cr-side-art"><i></i><i></i><i></i><i></i></div></aside>
        <main class="cr-main"><header class="cr-header"><div><div class="cr-eyebrow">CDEC PLACEMENT TRAINING · CLOUD BLITZ</div><h1>${esc(person)}</h1><h2>${esc(role)}</h2><div class="cr-contact">${esc(contact)}</div></div><div class="cr-mark"><span>CB</span><small>RESUME</small></div></header>
          <div class="cr-layout"><div class="cr-primary">${main.map(renderSection).join('')}</div><div class="cr-secondary">${side.map(renderSection).join('')}</div></div>
        </main>
      </div>
    </div>`;
  }
  window.resumes = () => `<div class="resume-library-pro"><div class="resume-library-hero"><div><div class="eyebrow">CLOUDBLITZ · CDEC</div><h3>Resume Library</h3><p>Two source resumes presented as polished, visual resume templates. The content remains mapped to the workbook.</p></div><div class="resume-hero-art"><div class="art-card a1">CV</div><div class="art-card a2">ATS</div><div class="art-card a3">CB</div></div></div><div class="resume-template-grid">${names.map((n,i)=>{const r=rowsFor(n);const fresher=i===0;return `<article class="resume-template ${fresher?'fresh-card':'exp-card'}"><div class="template-visual"><div class="tv-top"><span>${fresher?'FRESHER':'EXPERIENCED'}</span><b>CB</b></div><div class="tv-name">${esc(lines(r[1])[0]||'Candidate')}</div><div class="tv-role">${esc(lines(r[2])[0]||'')}</div><div class="tv-bars"><i></i><i></i><i></i><i></i></div><div class="tv-footer"><span>CloudBlitz</span><span>${r.length} source rows</span></div></div><div class="template-info"><span class="template-chip">${fresher?'Intern / Fresher':'Experienced'}</span><h4>${esc(n)}</h4><p>${fresher?'Clean, modern visual resume with internship, technical skills and profile sections.':'Premium professional layout for experience-led resume presentation and technical profile review.'}</p><button class="pill-btn primary" onclick="resume('${esc(n)}')">Open Visual Resume</button></div></article>`}).join('')}</div><div class="resume-note"><span>✓</span><div><b>Source-first presentation</b><small>Visual graphics and layout are presentation-only. Resume text is rendered from the actual workbook source.</small></div></div></div>`;
  window.resume = name => {
    if(!sheets[name]) return;
    const root=document.getElementById('app');
    root.innerHTML=`<div class="app"><header class="topbar"><div class="brand"><div class="brandmark">CB</div><div><h1>CloudBlitz CDEC Placement Training</h1><small>Resume Library · Visual Classroom</small></div></div><div class="top-actions"><button class="pill-btn" onclick="show('resumes')">← Resume Library</button></div></header><main class="content">${visualResume(name)}</main></div>`;
  };
  if(typeof window.render==='function') window.render();
})();