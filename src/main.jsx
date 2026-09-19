import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import scene from './assets/verdant-gate.webp';
import plaque from './assets/jade-plaque.webp';
import parchment from './assets/parchment.webp';
import sword from './assets/sword.webp';
import scroll from './assets/scroll.webp';
import sun from './assets/sun.webp';
import pack from './assets/pack.webp';
import cog from './assets/cog.webp';
import dice from './assets/dice.webp';
import crest from './assets/crest.webp';
import mote from './assets/mote.webp';
import './style.css';

const entries=[['play','Play now','Your next legend begins',sword],['how','How to play','A guide for the uninitiated',scroll],['gold','Gold Believers Campaign','Follow the golden thread',sun],['packs','Pack ripping','Unseal a little possibility',pack],['settings','Settings','Make this world your own',cog],['mini','Mini games','Small games. Tall tales.',dice]];
const whispers=['The old paths remember your name.','Beyond the gate, a thousand stories wait.','Not all who wander walk alone.'];
function App(){
 const [panel,setPanel]=useState(null),[whisper,setWhisper]=useState(0),[sound,setSound]=useState(()=>localStorage.getItem('cw-sound')==='true'),[motion,setMotion]=useState(()=>localStorage.getItem('cw-motion')===null?!matchMedia('(prefers-reduced-motion: reduce)').matches:localStorage.getItem('cw-motion')==='true'),[opened,setOpened]=useState(false),[score,setScore]=useState(0),[target,setTarget]=useState(4),[journey,setJourney]=useState(false);
 const nav=useRef([]),dialog=useRef(null),audio=useRef(null);
 useEffect(()=>{let id=setInterval(()=>setWhisper(w=>(w+1)%whispers.length),6500);return()=>clearInterval(id)},[]);
 useEffect(()=>{localStorage.setItem('cw-sound',sound);localStorage.setItem('cw-motion',motion)},[sound,motion]);
 useEffect(()=>{if(panel)dialog.current?.showModal();else dialog.current?.close()},[panel]);
 const chime=()=>{if(!sound)return;const ac=audio.current??=new AudioContext();ac.resume();const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(440,ac.currentTime);o.frequency.exponentialRampToValueAtTime(660,ac.currentTime+.15);g.gain.setValueAtTime(.035,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.35);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.35)};
 const open=id=>{chime();setPanel(id)};
 const close=()=>{setPanel(null);setTimeout(()=>nav.current.find(b=>b?.dataset.id===panel)?.focus(),0)};
 const navigate=e=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const i=nav.current.indexOf(document.activeElement);const n=e.key==='Home'?0:e.key==='End'?entries.length-1:(i+(e.key==='ArrowDown'?1:entries.length-1))%entries.length;nav.current[n]?.focus()};
 return <div className={`game ${motion?'':'still'}`} style={{'--paper':`url(${parchment})`,'--plate':`url(${plaque})`}}>
 <header><div className="small-brand"><img src={crest} alt=""/><span>CLAN WORLD<small>THE CHRONICLES OF BELONGING</small></span></div><div className="header-right"><span className="local-status"><i/> LOCAL ADVENTURE</span><button className="profile" onClick={()=>open('play')}><span className="avatar">W</span><span>Wanderer<small>Your story is unwritten</small></span></button><button className="audio-button" aria-label={sound?'Mute menu sound':'Enable menu sound'} onClick={()=>setSound(!sound)}>{sound?'♪':'♩'}<span>{sound?'ON':'OFF'}</span></button></div></header>
 <main>
 <div className="world" aria-label="A living view of the Verdant Gate"><img className="landscape" src={scene} alt="A luminous ancient gateway above a misty green valley, with travelers on the path"/><div className="world-shade"/><div className="gate-light"/>
 <div className="embers" aria-hidden="true">{Array.from({length:18},(_,i)=><img key={i} src={mote} style={{left:`${18+(i*17)%78}%`,top:`${20+(i*13)%70}%`,animationDelay:`${-i*1.3}s`,animationDuration:`${9+i%5}s`}}/>)}</div>
 <div className="chapter"><span>CHAPTER I</span><h2>The Verdant Gate</h2><p>A world worth belonging to.</p></div>
 <div className="scene-caption"><span className="eyebrow">FROM THE CHRONICLES</span><h3>Every legend begins<br/>with a first step.</h3><p>The gate is open. Your clan is out there.</p><button onClick={()=>open('lore')}>Discover the realm <span>↗</span></button></div><div className="scene-coordinate">THE ELDERWOOD <span>·</span> DAWN, FIRST LIGHT</div></div>
 <section className="menu"><div className="menu-heading"><div className="edition"><span/> A NEW CHAPTER AWAITS <span/></div><h1>CLAN<span>WORLD</span></h1><p>Find your people. Forge your legend.</p></div>
 <nav aria-label="Main menu" onKeyDown={navigate}>{entries.map(([id,label,sub,icon],i)=><button key={id} data-id={id} ref={el=>nav.current[i]=el} className={`menu-button ${i===0?'primary':''}`} onClick={()=>open(id)}><span className="plate"/><img src={icon} alt=""/><span className="button-copy"><strong>{label}</strong><small>{sub}</small></span>{id==='gold'?<span className="new">NEW</span>:i===0?<span className="play-arrow">▸</span>:null}</button>)}</nav>
 <div className="whisper"><span>✧</span><p key={whisper}>{whispers[whisper]}</p><span>✧</span></div></section>
 </main>
 <footer><div className="key-hints"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Select</span><span><kbd>esc</kbd> Back</span></div><span className="footer-motto">MANY CLANS. ONE WORLD.</span><span>ASTRA <b>·</b> PROTOTYPE 06</span></footer>
 <dialog aria-labelledby="panel-title" ref={dialog} onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===dialog.current)close()}}><div className="panel"><button className="close" aria-label="Close panel" onClick={close}>×</button><img className="panel-crest" src={panel==='packs'?pack:crest} alt=""/><span className="eyebrow">CLAN WORLD · THE VERDANT GATE</span><h2 id="panel-title">{entries.find(e=>e[0]===panel)?.[1]??'The Elderwood'}</h2>
 {panel==='play'&&<><p>{journey?'You have reached the gate, Wanderer. The rest of your story is still being written.':'The Elderwood is calling. Begin a local journey through the Verdant Gate.'}</p><div className="journey-preview"><img src={scene} alt="The Elderwood"/><span>{journey?'JOURNEY BEGUN':'CHAPTER I · THE GATE AWAKENS'}</span></div><button className="action" onClick={()=>{if(journey)close();else {setJourney(true);chime()}}}>{journey?'Return to the gate':'Begin your journey'}</button><small className="honest">{journey?'This is the end of the playable menu preview.':'Local prototype · no account required'}</small></>}
 {panel==='how'&&<><p>Every great story starts with a curious wanderer.</p><ol className="guide"><li><b>Enter the world</b><span>Choose Play now to preview the beginning of your journey.</span></li><li><b>Discover your belongings</b><span>Open a pack to reveal three keepsakes from the Elderwood.</span></li><li><b>Learn the old signs</b><span>Practice your reflexes in the Rune Hunt mini game.</span></li></ol><p className="honest">Use ↑ / ↓ to move through the menu, Enter to select, and Esc to return. Touch and mouse work too.</p></>}
 {panel==='gold'&&<><p className="italic">“We carry the light so others may find the way.”</p><p>The Gold Believers are the keepers of the first dawn. Follow their trail through the Elderwood and discover the story behind the golden sun.</p><div className="chapter-card"><img src={sun} alt="Golden sun medallion"/><div><b>Chapter 01 — A promise in gold</b><p>A story campaign is being written.<br/>More adventures will follow.</p></div></div><small className="honest">Campaign preview · not yet playable</small></>}
 {panel==='packs'&&<><p>{opened?'Three keepsakes. Three stories waiting to happen.':'A traveler left something for you. Break the seal.'}</p>{opened?<div className="rewards">{[[sword,'Wayfarer’s blade'],[sun,'Dawn medallion'],[scroll,'Forgotten map']].map(([img,name],i)=><div key={name} style={{animationDelay:`${i*.15}s`}}><img src={img} alt=""/><small>{i===1?'RARE':'COMMON'}</small><b>{name}</b></div>)}</div>:<img className="sealed-pack" src={pack} alt="Sealed olive leather pack"/>}<button className="action" onClick={()=>{setOpened(!opened);chime()}}>{opened?'Seal another pack':'Rip open pack'}</button><small className="honest">Free local demo · no purchases</small></>}
 {panel==='settings'&&<><p>Settle in. Make yourself at home.</p><label className="setting"><span><b>Menu sounds</b><small>A soft chime when you select</small></span><input type="checkbox" checked={sound} onChange={e=>setSound(e.target.checked)}/></label><label className="setting"><span><b>Living world</b><small>Drifting embers, light and whispers</small></span><input type="checkbox" checked={motion} onChange={e=>setMotion(e.target.checked)}/></label><small className="honest">Preferences are saved on this device.</small></>}
 {panel==='mini'&&<><p>Rune Hunt — touch the glowing sun to gather its light.</p><div className="score">LIGHT GATHERED <b>{score} / 10</b></div><div className="rune-grid">{Array.from({length:9},(_,i)=><button key={i} disabled={score>=10} aria-label={i===target?'Glowing sun':'Empty rune stone'} onClick={()=>{if(i===target){setScore(s=>s+1);setTarget(t=>(t+1+Math.floor(Math.random()*8))%9);chime()}}}>{i===target&&score<10?<img src={sun} alt=""/>:'·'}</button>)}</div>{score>=10&&<p role="status">The Elderwood shines a little brighter. Well played.</p>}<button className="action" onClick={()=>{setScore(0);setTarget(4)}}>Start again</button></>}
 {panel==='lore'&&<><p className="italic">Before there were kingdoms, there were clans.</p><p>Between the roots of the Elderwood lies a gate older than memory. Each dawn, its stones begin to glow. No one knows who built it. Everyone knows it is waiting.</p><p>Beyond it, scattered travelers gather beneath unfamiliar banners. A shared fire. A borrowed blade. The beginning of belonging.</p><button className="action" onClick={()=>setPanel('play')}>Answer the call</button></>}
 </div></dialog>
 </div>
}

createRoot(document.getElementById('root')).render(<App/>);
