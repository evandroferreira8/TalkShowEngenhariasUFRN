'use strict';

const photos = [
  {id:'talkshow-01', caption:'Retrato coletivo da primeira edição do Talk Show das Engenharias', categories:['pessoas'], layout:'big',pos:'center 40%'},
  {id:'talkshow-02', caption:'Ângelo Anderson de Oliveira, organizador do Talk Show das Engenharias', categories:['palco','pessoas'], layout:'wide',pos:'center 40%'},
  {id:'talkshow-03', caption:'Público reunido para acompanhar as apresentações', categories:['pessoas'], layout:'wide',pos:'center 52%'},
  {id:'talkshow-04', caption:'Rodrigo Santiago e os caminhos da engenharia', categories:['palco'], layout:'wide',pos:'center 44%'},
  {id:'talkshow-05', caption:'Robson Matos debate energia e petróleo', categories:['palco'], layout:'wide',pos:'center 40%'},
  {id:'talkshow-06', caption:'Renata Braga encerra o encontro com inovação e pesquisa', categories:['palco'], layout:'wide',pos:'center 45%'},
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
const photoDownload = document.getElementById('lightbox-download');
let visiblePhotos = photos;
let expandedPhotos = false;
const galleryMore = document.getElementById('gallery-more');
const galleryVisibleCount = document.getElementById('gallery-visible-count');
const galleryTotalCount = document.getElementById('gallery-total-count');
let photoIndex = 0;
let lastTrigger = null;
function urlFor(photo, small=false){return `assets/photos/${String(photo.id).startsWith('talkshow-')?photo.id:'img_'+photo.id}${small?'-sm':''}.webp`;}
function initialGalleryLimit(){
  return window.matchMedia('(max-width: 700px)').matches ? 6 : 10;
}
function drawGallery(){
  const total=visiblePhotos.length;
  const current=expandedPhotos?visiblePhotos:visiblePhotos.slice(0,initialGalleryLimit());
  const frag=document.createDocumentFragment();
  current.forEach((photo,i)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='gallery-photo'+(i===0?' is-feature':'');
    button.setAttribute('aria-label',`Ampliar fotografia ${i+1} de ${total}: ${photo.caption}`);
    const media=document.createElement('span');
    media.className='photo-media';
    const img=document.createElement('img');
    img.src=urlFor(photo,true);
    img.loading=i<3?'eager':'lazy';
    img.decoding='async';
    img.alt=photo.caption;
    img.style.objectPosition=photo.pos;
    img.addEventListener('error',()=>{
      const full=urlFor(photo);
      if(img.src!==full)img.src=full;
    },{once:true});
    const photoNumber=document.createElement('span');
    photoNumber.className='photo-number';
    photoNumber.textContent=String(i+1).padStart(2,'0');
    photoNumber.setAttribute('aria-hidden','true');
    const icon=document.createElement('span');
    icon.className='photo-icon';
    icon.textContent='↗';
    icon.setAttribute('aria-hidden','true');
    media.append(img,photoNumber,icon);
    const caption=document.createElement('span');
    caption.className='photo-caption';
    caption.textContent=photo.caption;
    button.append(media,caption);
    button.addEventListener('click',()=>openPhoto(i,button));
    frag.append(button);
  });
  grid.replaceChildren(frag);
  count.textContent=`${String(total).padStart(2,'0')} ${total===1?'FOTOGRAFIA':'FOTOGRAFIAS'}`;
  galleryVisibleCount.textContent=String(current.length);
  galleryTotalCount.textContent=String(total);
  galleryMore.hidden=total<=initialGalleryLimit();
  galleryMore.setAttribute('aria-expanded',String(expandedPhotos));
  galleryMore.innerHTML=expandedPhotos
    ? 'Mostrar menos fotografias <span aria-hidden="true">↑</span>'
    : 'Ver todas as fotografias <span aria-hidden="true">↓</span>';
}
function renderPhotos(filter='todos'){
  visiblePhotos=photos.filter(photo=>filter==='todos'||photo.categories.includes(filter));
  expandedPhotos=false;
  drawGallery();
}
galleryMore.addEventListener('click',()=>{
  expandedPhotos=!expandedPhotos;
  drawGallery();
});
let galleryMobile=window.matchMedia('(max-width: 700px)').matches;
window.addEventListener('resize',()=>{
  const mobile=window.matchMedia('(max-width: 700px)').matches;
  if(mobile!==galleryMobile && !expandedPhotos){
    galleryMobile=mobile;
    drawGallery();
  } else {galleryMobile=mobile;}
},{passive:true});
function updatePhoto(){
  const photo=visiblePhotos[photoIndex];if(!photo)return;
  const largePhotoUrl=urlFor(photo);
  photoView.src=largePhotoUrl;photoView.alt=photo.caption;
  photoDownload.href=largePhotoUrl;
  photoDownload.download=`Talk-Show-das-Engenharias_Rodrigo-Melo_${photo.id}.webp`;
  photoDownload.setAttribute('aria-label',`Baixar em alta resolução: ${photo.caption}; fotografia de Rodrigo Melo`);
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
// Fecha a navegação móvel com Escape, preservando o foco no botão.
document.addEventListener('keydown',event=>{
 if(event.key==='Escape' && !mobileNav.hidden && !lightbox.open){
   closeMenu();
   toggle.focus();
 }
});
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

/* Controle explícito para voltar ao topo; não depende do hash de navegação. */
const floatingTopLink=document.getElementById('floating-top-link');
if(floatingTopLink){
  const footerSection=document.querySelector('.site-footer');
  const updateFloatingTopLink=()=>{
    // Oculta o botão flutuante quando o rodapé já oferece o link de topo.
    const footerVisible=footerSection && footerSection.getBoundingClientRect().top<window.innerHeight-18;
    floatingTopLink.classList.toggle('is-visible',window.scrollY>220 && !footerVisible);
    // Em celulares, o visor pode ser menor que a largura/altura de layout
    // (barras do navegador, zoom e teclado virtual). Fixar no visor real.
    const visual=window.visualViewport;
    const rightInset=visual?Math.max(0,window.innerWidth-visual.offsetLeft-visual.width):0;
    const bottomInset=visual?Math.max(0,window.innerHeight-visual.offsetTop-visual.height):0;
    floatingTopLink.style.right=`calc(${Math.ceil(rightInset+16)}px + env(safe-area-inset-right, 0px))`;
    floatingTopLink.style.bottom=`calc(${Math.ceil(bottomInset+16)}px + env(safe-area-inset-bottom, 0px))`;
  };
  floatingTopLink.addEventListener('click',()=>{
    if(!mobileNav.hidden)closeMenu();
    window.scrollTo({
      top:0,
      left:0,
      behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'
    });
  });
  window.addEventListener('scroll',updateFloatingTopLink,{passive:true});
  window.addEventListener('pageshow',updateFloatingTopLink);
  window.addEventListener('resize',updateFloatingTopLink,{passive:true});
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',updateFloatingTopLink,{passive:true});
    window.visualViewport.addEventListener('scroll',updateFloatingTopLink,{passive:true});
  }
  updateFloatingTopLink();
}
