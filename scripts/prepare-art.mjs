import sharp from 'sharp';
const root=process.argv[2];
if(!root)throw new Error('Pass the directory containing the four original generated PNGs, with a trailing slash. Production assets are already committed.');
const out='src/assets/';
await sharp(root+'exec-0408bc14-04ac-446e-8142-4516d5d57d96.png').webp({quality:87}).toFile(out+'verdant-gate.webp');
await sharp(root+'exec-f9effbc7-fae1-43af-959b-37d0e4a2de31.png').webp({quality:80}).toFile(out+'parchment.webp');
await sharp(root+'exec-a361de21-7b7a-4423-b69a-da1784f5b6d2.png').trim().resize({width:1000}).webp({quality:92}).toFile(out+'jade-plaque.webp');
const atlas=root+'exec-1cd4899b-3764-42e6-bc40-74ff2b256f66.png';
const boxes=[['sword',80,0,270,438],['scroll',420,20,410,390],['sun',850,0,400,415],['pack',0,438,400,393],['cog',430,440,390,375],['dice',850,450,404,365],['crest',0,835,415,415],['cursor',440,835,390,415],['mote',870,850,350,400]];
for(const [name,left,top,width,height] of boxes){const s=sharp(await sharp(atlas).extract({left,top,width,height}).toBuffer()).trim();await s.clone().resize({width:name==='mote'?64:200,height:name==='mote'?64:200,fit:'inside'}).webp({quality:90}).toFile(out+name+'.webp');if(name==='cursor')await s.clone().resize(32,32,{fit:'inside'}).png().toFile(out+'cursor.png');}
