#!/usr/bin/env node
const fs = require('fs');
const fetch = global.fetch || require('node-fetch');
const base = process.env.QA_BASE_URL || 'http://localhost:3000';

function extractBlock(content, startMarker) {
  const start = content.indexOf(startMarker);
  if (start === -1) return '';
  const rest = content.slice(start);
  const end = rest.indexOf('];');
  if (end === -1) return rest;
  return rest.slice(0, end + 2);
}

function parseSlugsFromObjects(block) {
  const regex = /slug:\s*'([^']+)'/g;
  const res = [];
  let m;
  while ((m = regex.exec(block))) res.push(m[1]);
  return res;
}

function parseUseCases(block) {
  const regex = /'([^']+)'/g;
  const res = [];
  let m;
  while ((m = regex.exec(block))) res.push(m[1]);
  return res;
}

(async function main(){
  const file = fs.readFileSync('./lib/prompts.ts','utf8');
  const catBlock = extractBlock(file, 'export const categories');
  const categories = parseSlugsFromObjects(catBlock);
  const indBlock = extractBlock(file, 'export const industries');
  const industries = parseSlugsFromObjects(indBlock);
  const useBlock = extractBlock(file, 'export const useCases');
  const useCases = parseUseCases(useBlock);

  // Fetch sitemap to get prompt URLs
  const sitemapRes = await fetch(base + '/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  const promptUrls = Array.from(sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m=>m[1]).filter(u=>u.includes('/prompts/'));
  // pick 5 random
  const picked = [];
  const max = Math.min(5, promptUrls.length);
  const used = new Set();
  while (picked.length < max) {
    const i = Math.floor(Math.random()*promptUrls.length);
    if (used.has(i)) continue; used.add(i);
    picked.push(promptUrls[i]);
  }

  const toCheck = [];
  toCheck.push({path: '/', url: base + '/'});
  categories.forEach(s => toCheck.push({path:`/${s}`, url: base + '/' + s}));
  industries.forEach(s => toCheck.push({path:`/industry/${s}`, url: base + '/industry/' + s}));
  useCases.forEach(s => toCheck.push({path:`/use-case/${s}`, url: base + '/use-case/' + s}));
  picked.forEach(u => toCheck.push({path: new URL(u).pathname, url: u}));
  toCheck.push({path:'/sitemap.xml', url: base + '/sitemap.xml'});
  toCheck.push({path:'/robots.txt', url: base + '/robots.txt'});

  const results = [];

  async function checkUrl(entry){
    try{
      const t0 = Date.now();
      const res = await fetch(entry.url, {redirect:'manual'});
      const t1 = Date.now();
      const text = await res.text();
      const errors = [];
      if (res.status >= 500) errors.push('500');
      if (res.status === 404) errors.push('404');
      // simple runtime error heuristics
      if (/(Unhandled Runtime Error|Internal Server Error)/i.test(text)) errors.push('runtime error in body');
      results.push({entry, status: res.status, time: t1-t0, errors, links: []});

      // parse links for broken link checks only for HTML pages
      if ((res.headers.get('content-type')||'').includes('text/html')){
        const hrefs = Array.from(text.matchAll(/href=(?:"|')(.*?)(?:"|')/g)).map(m=>m[1]);
        const internal = hrefs.filter(h => h && (h.startsWith('/') || h.startsWith(base)) && !h.startsWith('mailto:') && !h.startsWith('tel:'))
          .map(h => h.startsWith(base) ? new URL(h).pathname : h.split('#')[0]);
        // test unique
        const uniq = [...new Set(internal)].slice(0,200);
        for (const link of uniq){
          const full = base + (link.startsWith('/') ? link : '/' + link);
          try{
            const r = await fetch(full, {method:'HEAD'});
            if (r.status >= 400) results[results.length-1].links.push({link, status: r.status});
          }catch(e){
            results[results.length-1].links.push({link, status: 'error', message: String(e)});
          }
        }
      }

    }catch(e){
      results.push({entry, status: 'error', time:0, errors:[String(e)], links:[]});
    }
  }

  for (const e of toCheck){
    process.stdout.write(`Checking ${e.path} ... `);
    await checkUrl(e);
    process.stdout.write('done\n');
  }

  // Report
  const report = {checked: results.length, failures: results.filter(r=> (r.status==='error' || r.status>=400 || (r.errors && r.errors.length>0))).map(r=>({path: r.entry.path, url: r.entry.url, status: r.status, errors: r.errors, links: r.links})) };
  console.log('\nQA Report:\n');
  console.log(JSON.stringify(report, null, 2));

  // Save
  fs.writeFileSync('./qa-report.json', JSON.stringify(report, null, 2));
  console.log('\nSaved ./qa-report.json');
})();
