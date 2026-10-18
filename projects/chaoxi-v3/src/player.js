if(!RENDER_MODE){
 const film=document.getElementById('film'),canvas=document.getElementById('out'),scrub=document.getElementById('scrub'),mode=document.getElementById('mode'),inspect=document.getElementById('inspect'),label=document.getElementById('tt');
 film.src=film.dataset.src;film.poster=film.dataset.poster;
 let inspecting=false,busy=false,wanted=null;
 const show=t=>{const shot=FILM_DATA.shots.find(s=>t>=s.start_s&&t<s.end_s)||FILM_DATA.shots.at(-1);label.textContent=`${t.toFixed(2)} / 56 s · ${shot.id} ${shot.summary}`;};
 async function requestFrame(t){wanted=t;if(busy||!window.ready)return;busy=true;
  try{while(wanted!==null){const at=wanted;wanted=null;await window.renderAt(at);}}
  catch(e){document.getElementById('status').textContent='审查渲染失败：'+e.message;}
  finally{busy=false;}
 }
 window.installFilmInspector=()=>{if(inspecting)requestFrame(+scrub.value);};
 film.ontimeupdate=()=>{if(!inspecting){scrub.value=film.currentTime;show(film.currentTime);}};
 mode.onclick=()=>{inspecting=false;canvas.style.display='none';film.style.display='block';mode.classList.add('active');inspect.classList.remove('active');film.currentTime=+scrub.value;show(+scrub.value);};
 inspect.onclick=()=>{inspecting=true;film.pause();canvas.style.display='block';film.style.display='none';mode.classList.remove('active');inspect.classList.add('active');requestFrame(+scrub.value);show(+scrub.value);};
 scrub.addEventListener('input',()=>{if(inspecting)requestFrame(+scrub.value);else film.currentTime=+scrub.value;show(+scrub.value);});
 film.onerror=()=>{document.getElementById('status').textContent='成片尚未导出；可点击逐镜审查查看渲染画面。';};show(0);
}
