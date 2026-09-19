import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',use:{baseURL:'http://localhost:5186/main-menu/astra-v6/',launchOptions:{executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']}},webServer:{command:'npm run preview -- --port 5186',url:'http://localhost:5186/main-menu/astra-v6/',reuseExistingServer:false}});
