import { spawn } from 'node:child_process';
const p=spawn(process.platform==='win32'?'npx.cmd':'npx',['http-server','dist','-p','4173'],{stdio:'inherit'});p.on('exit',c=>process.exit(c??0));
