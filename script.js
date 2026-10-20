// Curated starter data. Photos are illustrative, not necessarily photographs of each venue.
const places = [
  {id:'central',name:'Café Central',category:'coffee',district:'1010',neighborhood:'Innere Stadt',moods:['slow'],description:'A grand, historic Viennese coffeehouse experience.',lat:48.2104,lng:16.3653,image:'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80'},
  {id:'mq',name:'MuseumsQuartier',category:'culture',district:'1070',neighborhood:'Neubau',moods:['art'],description:'A lively meeting place for art, architecture and city life.',lat:48.2030,lng:16.3585,image:'https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=900&q=80'},
  {id:'prater',name:'Wiener Prater',category:'outdoors',district:'1020',neighborhood:'Leopoldstadt',moods:['fresh'],description:'Old-school fun, wide avenues and room to wander.',lat:48.2167,lng:16.3959,image:'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=900&q=80'},
  {id:'burggarten',name:'Burggarten',category:'outdoors',district:'1010',neighborhood:'Innere Stadt',moods:['fresh','slow'],description:'An easy green pause right in the heart of the city.',lat:48.2047,lng:16.3664,image:'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80'},
  {id:'belvedere',name:'Belvedere',category:'culture',district:'1030',neighborhood:'Landstraße',moods:['art','fresh'],description:'Baroque gardens and an extraordinary art collection.',lat:48.1915,lng:16.3809,image:'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80'},
  {id:'kahlenberg',name:'Kahlenberg',category:'outdoors',district:'1190',neighborhood:'Döbling',moods:['fresh'],description:'A hillside viewpoint when you want to see the city from above.',lat:48.2768,lng:16.3365,image:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80'}
];

const state={category:'all',mood:'all',search:'',savedOnly:false};
const grid=document.querySelector('#places-grid');
const empty=document.querySelector('#empty-state');
const count=document.querySelector('#result-count');
const savedCount=document.querySelector('#saved-count');
const savedToggle=document.querySelector('#show-saved');
let saved=new Set();
try {const stored=JSON.parse(localStorage.getItem('njv-saved')||'[]'); if(Array.isArray(stored)) saved=new Set(stored.filter(x=>typeof x==='string'));}catch(e){/* browsing still works without storage */}
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const directions=p=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name+' Vienna')}`;
const label={coffee:'COFFEE',culture:'CULTURE',outdoors:'OUTDOORS'};

function filteredPlaces(){return places.filter(p=>(state.category==='all'||p.category===state.category)&&(state.mood==='all'||p.moods.includes(state.mood))&&(!state.savedOnly||saved.has(p.id))&&`${p.name} ${p.neighborhood} ${p.district} ${p.description}`.toLowerCase().includes(state.search));}
function render(){const shown=filteredPlaces();count.textContent=`${shown.length} HANDPICKED ${shown.length===1?'SPOT':'SPOTS'}`;savedCount.textContent=saved.size;empty.hidden=shown.length!==0;grid.innerHTML=shown.map(p=>`<article class="place-card"><div class="place-image"><img src="${p.image}" alt="Illustrative atmosphere for ${escapeHTML(p.name)}" loading="lazy"><span class="image-label">${label[p.category]}</span><button class="save-btn ${saved.has(p.id)?'saved':''}" type="button" data-save="${p.id}" aria-label="${saved.has(p.id)?'Remove':'Save'} ${escapeHTML(p.name)}" aria-pressed="${saved.has(p.id)}">${saved.has(p.id)?'♥':'♡'}</button></div><div class="place-heading"><h3>${escapeHTML(p.name)}</h3><span>${p.district} WIEN</span></div><p>${escapeHTML(p.description)}</p><div class="place-links"><span>${escapeHTML(p.neighborhood)}</span><a href="${directions(p)}" target="_blank" rel="noopener noreferrer">DIRECTIONS ↗</a></div></article>`).join('');}

document.querySelectorAll('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{state.category=btn.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>{const on=x===btn;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on));});render();}));
document.querySelectorAll('[data-mood]').forEach(btn=>btn.addEventListener('click',()=>{state.mood=btn.dataset.mood;document.querySelectorAll('[data-mood]').forEach(x=>{const on=x===btn;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on));});render();}));
document.querySelector('#search').addEventListener('input',e=>{state.search=e.target.value.toLowerCase().trim();render();});
savedToggle.addEventListener('click',()=>{state.savedOnly=!state.savedOnly;savedToggle.setAttribute('aria-pressed',String(state.savedOnly));savedToggle.textContent=state.savedOnly?'← SHOW ALL SPOTS':'♡ MY SAVED SPOTS ('+saved.size+')';render();});
grid.addEventListener('click',e=>{const btn=e.target.closest('[data-save]');if(!btn)return;const id=btn.dataset.save;if(saved.has(id))saved.delete(id);else saved.add(id);try{localStorage.setItem('njv-saved',JSON.stringify([...saved]));}catch(e){}if(!state.savedOnly)savedToggle.textContent='♡ MY SAVED SPOTS ('+saved.size+')';render();});
document.querySelector('#surprise').addEventListener('click',()=>{const pool=filteredPlaces().length?filteredPlaces():places;const p=pool[Math.floor(Math.random()*pool.length)];document.querySelector('#search').value=p.name;state.search=p.name.toLowerCase();state.category='all';state.mood='all';state.savedOnly=false;document.querySelectorAll('[data-category],[data-mood]').forEach(btn=>{const on=btn.dataset.category==='all'||btn.dataset.mood==='all';btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on));});savedToggle.setAttribute('aria-pressed','false');savedToggle.textContent='♡ MY SAVED SPOTS ('+saved.size()+')';render();document.querySelector('#discover').scrollIntoView({behavior:'smooth'});});
render();

// Interactive map: works when Leaflet and OpenStreetMap tiles can be loaded.
const mapNode=document.querySelector('#vienna-map');
if(typeof L!=='undefined'){
  const map=L.map(mapNode,{scrollWheelZoom:false}).setView([48.213,16.373],12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map);
  places.forEach(p=>L.marker([p.lat,p.lng]).addTo(map).bindPopup(`<div class="map-popup"><strong>${escapeHTML(p.name)}</strong><br>${escapeHTML(p.neighborhood)}<br><a href="${directions(p)}" target="_blank" rel="noopener noreferrer">DIRECTIONS ↗</a></div>`));
}else{mapNode.innerHTML='<p style="padding:30px">Map could not load. Check your connection or open the full city map using the link.</p>';}
