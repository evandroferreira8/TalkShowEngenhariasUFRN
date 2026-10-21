'use strict';

const photos = [
  {id:'8188', caption:'A engenharia em diálogo com o público', categories:['pessoas','palco'], layout:'big', pos:'54% center'},
  {id:'8064', caption:'A música na abertura do evento', categories:['bastidores'], layout:'wide',pos:'center 53%'},
  {id:'8071', caption:'Chegada e acolhimento dos participantes', categories:['bastidores','pessoas'], layout:'tall',pos:'center 35%'},
  {id:'8084', caption:'Materiais e Deep Techs com Rodolfo Luiz', categories:['palco'], layout:'wide',pos:'65% center'},
  {id:'8139', caption:'Olhares atentos na plateia', categories:['pessoas'], layout:'',pos:'center center'},
  {id:'8079', caption:'Um encontro para compartilhar ideias', categories:['palco'], layout:'tall',pos:'center 37%'},
  {id:'8152', caption:'Rodrigo Santiago e os caminhos da profissão', categories:['palco'], layout:'wide',pos:'center center'},
  {id:'8172', caption:'A participação faz parte da conversa', categories:['pessoas'], layout:'wide',pos:'57% center'},
  {id:'8140', caption:'Pesquisa de fronteira em apresentação', categories:['palco'], layout:'tall',pos:'center 25%'},
  {id:'8197', caption:'Diálogo com a plateia', categories:['pessoas'], layout:'',pos:'center center'},
  {id:'8223', caption:'Um intervalo para novas conexões', categories:['bastidores'], layout:'wide',pos:'center center'},
  {id:'8211', caption:'O cenário da energia em debate', categories:['palco'], layout:'',pos:'56% center'},
  {id:'8238', caption:'Universidade e mercado em diálogo', categories:['palco'], layout:'wide',pos:'53% center'},
  {id:'8203', caption:'A plateia acompanha o encontro', categories:['pessoas'], layout:'',pos:'45% center'},
  {id:'8085', caption:'O papel da engenharia de materiais', categories:['palco'], layout:'',pos:'center center'},
  {id:'8215', caption:'Robson Matos e o setor produtivo', categories:['palco'], layout:'wide',pos:'64% center'},
  {id:'8259', caption:'Ciro Lobo: do papel à realidade', categories:['palco'], layout:'',pos:'center center'},
  {id:'8273', caption:'Ciro Lobo: soluções industriais', categories:['palco'], layout:'big',pos:'70% center'},
  {id:'8278', caption:'Renata Braga: inovação com propósito', categories:['palco','bastidores'], layout:'',pos:'center center'},
  {id:'8302', caption:'O encerramento do encontro', categories:['palco'], layout:'wide',pos:'center center'}
];

const grid = document.getElementById('gallery-grid');
const count = document.getElementById('gallery-counter');
const lightbox = document.getElementById('lightbox');
const photoView = document.getElementById('lightbox-img');
const photoCaption = document.getElementById('lightbox-caption');
const photoCount = document.getElementById('lightbox-count');
let visiblePhotos = photos;
let photoIndex = 0;
let lastTrigger = null;
function urlFor(photo, small=false){return `assets/photos/img_${photo.id}${small?'-sm':''}.webp`;}
function renderPhotos(filter='todos'){
  visiblePhotos = photos.filter(photo=>filter==='todos'||photo.categories.includes(filter));
  grid.innerHTML='';
  const frag=document.createDocumentFragment();
  visiblePhotos.forEach((photo,i)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className=`gallery-photo ${photo.layout}`;
    button.setAttribute('aria-label',`Ampliar fotografia: ${photo.caption}`);
    const img=document.createElement('img');
    img.src=urlFor(photo,true);
    img.loading='lazy';img.decoding='async';img.alt=photo.caption;
    img.style.objectPosition=photo.pos;
    const caption=document.createElement('span');caption.className='photo-caption';caption.textContent=photo.caption;
    const icon=document.createElement('span');icon.className='photo-icon';icon.textContent='↗';icon.setAttribute('aria-hidden','true');
    button.append(img,caption,icon);
    button.addEventListener('click',()=>openPhoto(i,button));
    frag.append(button);
  });
  grid.append(frag);
  count.textContent=`${String(visiblePhotos.length).padStart(2,'0')} ${visiblePhotos.length===1?'FOTOGRAFIA':'FOTOGRAFIAS'}`;
}
function updatePhoto(){
  const photo=visiblePhotos[photoIndex];if(!photo)return;
  photoView.src=urlFor(photo);photoView.alt=photo.caption;
  photoCaption.textContent=photo.caption;
  photoCount.textContent=`${String(photoIndex+1).padStart(2,'0')} / ${String(visiblePhotos.length).padStart(2,'0')}`;
}
function openPhoto(index,trigger){
  if(!visiblePhotos.length)return;
  photoIndex=index;lastTrigger=trigger;
  updatePhoto();lightbox.showModal();document.body.classList.add('no-scroll');
  document.getElementById('lightbox-close').focus();
}
function closePhoto(){lightbox.close();}
function stepPhoto(direction){photoIndex=(photoIndex+direction+visiblePhotos.length)%visiblePhotos.length;updatePhoto();}
document.getElementById('lightbox-close').addEventListener('click',closePhoto);
document.getElementById('lightbox-prev').addEventListener('click',()=>stepPhoto(-1));
document.getElementById('lightbox-next').addEventListener('click',()=>stepPhoto(1));
lightbox.addEventListener('close',()=>{document.body.classList.remove('no-scroll');photoView.removeAttribute('src');lastTrigger?.focus();});
lightbox.addEventListener('click',event=>{if(event.target===lightbox)closePhoto();});
document.addEventListener('keydown',event=>{
  if(!lightbox.open)return;
  if(event.key==='ArrowLeft'){event.preventDefault();stepPhoto(-1);}
  else if(event.key==='ArrowRight'){event.preventDefault();stepPhoto(1);}
});
document.querySelectorAll('.filter-btn').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter-btn').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});
  button.classList.add('active');button.setAttribute('aria-pressed','true');
  renderPhotos(button.dataset.filter);
}));
renderPhotos();

const toggle = document.getElementById('menu-toggle');
const mobileNav=document.getElementById('mobile-nav');
function closeMenu(){mobileNav.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');document.body.classList.remove('no-scroll');}
toggle.addEventListener('click',()=>{
  const next=toggle.getAttribute('aria-expanded')!=='true';
  toggle.setAttribute('aria-expanded',String(next));
  toggle.setAttribute('aria-label',next?'Fechar menu':'Abrir menu');
  mobileNav.hidden=!next;
  document.body.classList.toggle('no-scroll',next);
});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
window.addEventListener('resize',()=>{if(window.innerWidth>920&&!mobileNav.hidden)closeMenu();});

const progress=document.getElementById('scroll-progress');
let scheduled=false;
window.addEventListener('scroll',()=>{
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(()=>{
   const available=document.documentElement.scrollHeight-window.innerHeight;
   progress.style.width=`${available>0?(window.scrollY/available)*100:0}%`;
   scheduled=false;
 });
},{passive:true});

if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.09,rootMargin:'0px 0px -10px 0px'});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));}
