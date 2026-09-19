import {test,expect} from '@playwright/test';
test('production base, assets, keyboard and all panels',async({page})=>{
 const failures=[];page.on('pageerror',e=>failures.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push(r.url())});
 await page.goto('');await expect(page.getByRole('navigation').getByRole('button')).toHaveCount(6);
 const play=page.getByRole('button',{name:'Play now Your next legend begins'});await play.focus();await page.keyboard.press('ArrowDown');await expect(page.getByRole('button',{name:'How to play A guide for the uninitiated'})).toBeFocused();await page.keyboard.press('Enter');await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
 for(const id of ['play','how','gold','packs','settings','mini']){await page.locator(`[data-id="${id}"]`).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Close panel'}).click()}
 expect(await page.evaluate(()=>[...document.images].filter(i=>!i.complete||!i.naturalWidth).length)).toBe(0);expect(failures).toEqual([]);
});
test('journey, pack reveal and complete mini game',async({page})=>{
 await page.goto('');await page.locator('[data-id="play"]').click();await page.getByRole('button',{name:'Begin your journey'}).click();await expect(page.getByText('JOURNEY BEGUN')).toBeVisible();await page.getByRole('button',{name:'Return to the gate'}).click();await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.locator('[data-id="packs"]').click();await page.getByRole('button',{name:'Rip open pack'}).click();await expect(page.getByText('Dawn medallion')).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('[data-id="mini"]').click();for(let i=0;i<10;i++)await page.getByRole('button',{name:'Glowing sun'}).click();await expect(page.getByRole('status')).toContainText('Well played');await page.getByRole('button',{name:'Start again'}).click();await expect(page.getByText('0 / 10')).toBeVisible();
});
test('settings persist and reduced motion is respected',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('');await expect(page.locator('.game')).toHaveClass(/still/);await page.locator('[data-id="settings"]').click();await page.getByLabel('Menu sounds').check();await page.getByLabel('Living world').check();await page.reload();await page.locator('[data-id="settings"]').click();await expect(page.getByLabel('Menu sounds')).toBeChecked();await expect(page.getByLabel('Living world')).toBeChecked();
});
for(const [name,width,height] of [['desktop',1440,960],['mobile',390,844]])test(`${name} layout and screenshot`,async({page})=>{await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('');expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);await expect(page.locator('[data-id="mini"]')).toBeVisible();await page.screenshot({path:`artifacts/${name}.png`,fullPage:true});});
