import {chromium} from '@playwright/test';
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const [name,width,height] of [['desktop',1440,960],['mobile',390,844]]){const p=await b.newPage({viewport:{width,height},reducedMotion:'reduce'});await p.goto('http://localhost:5173/main-menu/astra-v6/');await p.screenshot({path:`artifacts/${name}.png`,fullPage:true});console.log(name,await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length})));await p.close()}
await b.close();
