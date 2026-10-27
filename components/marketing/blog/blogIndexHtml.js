// Generated from the "BlogIndex" design file. Rendered by BlogDesignBody.
export const blogIndexHtml = `<style>.blog-design .gxb .bw{max-width:1160px;margin:0 auto;padding:0 24px}
.blog-design .gxb .eb{color:#088256;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
.blog-design .gxb .bh1{margin:12px 0 0;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:56px;letter-spacing:-.035em;line-height:1.04;max-width:820px}
.blog-design .gxb .blede{margin:16px 0 0;color:#4b5a52;font-size:18px;line-height:1.6;font-weight:600;max-width:640px}
.blog-design .gxb .chips{display:flex;gap:8px;flex-wrap:wrap}
.blog-design .gxb .chip{height:36px;padding:0 16px;border-radius:999px;border:1px solid #dfe7e2;background:#fff;font:800 13px 'Manrope',sans-serif;color:#2c3b33;cursor:pointer}
.blog-design .gxb .chip.on{background:#0a5d3f;border-color:#0a5d3f;color:#fff}
.blog-design .gxb .search{display:flex;align-items:center;gap:10px;height:42px;width:300px;padding:0 14px;border-radius:999px;border:1px solid #dfe7e2;color:#9aa8a0;font-size:13.5px;font-weight:600}
.blog-design .gxb .cover{border-radius:20px;position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:22px}
.blog-design .gxb .cover::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 80% 20%,rgba(255,255,255,.35),transparent 55%)}
.blog-design .gxb .cover span{position:relative;z-index:1;font-family:'Space Grotesk',sans-serif;font-weight:600;color:#fff;letter-spacing:-.02em}
.blog-design .gxb .c1{background:linear-gradient(140deg,#0a5d3f,#00a86b)}
.blog-design .gxb .c2{background:linear-gradient(140deg,#123b6b,#3b82f6)}
.blog-design .gxb .c3{background:linear-gradient(140deg,#4c1d95,#8b5cf6)}
.blog-design .gxb .c4{background:linear-gradient(140deg,#7c2d12,#f97316)}
.blog-design .gxb .c5{background:linear-gradient(140deg,#064e3b,#14b8a6)}
.blog-design .gxb .c6{background:linear-gradient(140deg,#1f2937,#64748b)}
.blog-design .gxb .feat{display:grid;grid-template-columns:1.25fr 1fr;gap:36px;align-items:center;padding:28px;border-radius:28px;background:#f6faf8;border:1px solid #e7ede9}
.blog-design .gxb .feat .cover{height:340px}
.blog-design .gxb .feat .cover span{font-size:30px;max-width:420px}
.blog-design .gxb .meta{display:flex;gap:10px;align-items:center;flex-wrap:wrap;color:#69786f;font-size:13px;font-weight:700}
.blog-design .gxb .tg{display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:999px;background:#ecfdf3;color:#0a5d3f;font-size:12px;font-weight:800}
.blog-design .gxb .ft{margin:14px 0 0;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:34px;letter-spacing:-.025em;line-height:1.12;color:#0a1712}
.blog-design .gxb .fx{margin:12px 0 0;color:#4b5a52;font-size:16px;line-height:1.65;font-weight:600}
.blog-design .gxb .au{display:flex;align-items:center;gap:10px;margin-top:18px;font-size:13px;font-weight:700;color:#2c3b33}
.blog-design .gxb .av{width:34px;height:34px;border-radius:50%;background:#0a5d3f;color:#6fe7b0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800}
.blog-design .gxb .rl{display:inline-flex;align-items:center;gap:6px;margin-top:20px;font-weight:800;font-size:14px}
.blog-design .gxb .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.blog-design .gxb .card{background:none;border:0;box-shadow:none;padding:0;border-radius:0;display:flex;flex-direction:column;gap:12px;color:#0a1712}
.blog-design .gxb .card .cover{height:210px}
.blog-design .gxb .card .cover span{font-size:20px}
.blog-design .gxb .card h3{margin:2px 0 0;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:21px;letter-spacing:-.02em;line-height:1.25}
.blog-design .gxb .card p{margin:0;color:#4b5a52;font-size:14px;line-height:1.6;font-weight:600}
.blog-design .gxb .card:hover h3{color:#088256}
.blog-design .gxb .nl{display:flex;justify-content:space-between;align-items:center;gap:28px;flex-wrap:wrap;padding:40px;border-radius:28px;background:#041f16;color:#fff}
.blog-design .gxb .nl h2{margin:0;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:30px;letter-spacing:-.02em}
.blog-design .gxb .nl p{margin:8px 0 0;color:rgba(255,255,255,.65);font-size:15px;font-weight:600}
.blog-design .gxb .nlf{display:flex;gap:8px}
.blog-design .gxb .nlf span{display:flex;align-items:center;width:280px;height:48px;padding:0 18px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:rgba(255,255,255,.5);font-size:14px;font-weight:600}
.blog-design .gxb .btp{display:inline-flex;align-items:center;gap:8px;height:48px;padding:0 22px;border-radius:999px;background:linear-gradient(180deg,#29d68f,#00c27a);color:#06231a!important;font-weight:800;font-size:14px}
.blog-design .gxb .art{display:grid;grid-template-columns:220px minmax(0,680px) 1fr;gap:48px;align-items:start}
.blog-design .gxb .toc{position:sticky;top:24px;display:flex;flex-direction:column;gap:4px}
.blog-design .gxb .toc b{font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#69786f;margin-bottom:6px}
.blog-design .gxb .toc a{padding:7px 12px;border-left:2px solid #e7ede9;color:#4b5a52;font-size:13.5px;font-weight:700}
.blog-design .gxb .toc a.on{border-color:#00a86b;color:#0a5d3f;background:#f4fbf7}
.blog-design .gxb .prose{color:#2c3b33;font-size:17.5px;line-height:1.8;font-weight:500}
.blog-design .gxb .prose h2{margin:44px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:30px;letter-spacing:-.02em;color:#0a1712;line-height:1.2}
.blog-design .gxb .prose p{margin:0 0 18px}
.blog-design .gxb .prose ul{margin:0 0 18px;padding-left:22px}
.blog-design .gxb .prose li{margin-bottom:8px}
.blog-design .gxb .prose blockquote{margin:26px 0;padding:18px 22px;border-left:4px solid #00a86b;background:#f4fbf7;border-radius:0 14px 14px 0;font-weight:700;color:#0a3d29}
.blog-design .gxb .callout{margin:28px 0;padding:22px;border-radius:18px;background:#041f16;color:#fff;display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap}
.blog-design .gxb .callout b{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:20px}
.blog-design .gxb .callout small{display:block;margin-top:4px;color:rgba(255,255,255,.65);font-size:14px;font-weight:600}
.blog-design .gxb .share{display:flex;flex-direction:column;gap:8px;position:sticky;top:24px}
.blog-design .gxb .share b{font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#69786f}
.blog-design .gxb .share span{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;border:1px solid #e1e8e4;font-size:12px;font-weight:800;color:#2c3b33}
@media (max-width:1000px){.blog-design .gxb .feat,.blog-design .gxb .art{grid-template-columns:minmax(0,1fr)}
.blog-design .gxb .grid3{grid-template-columns:repeat(2,minmax(0,1fr))}
.blog-design .gxb .toc,.blog-design .gxb .share{display:none}
.blog-design .gxb .bh1{font-size:40px}}
@media (max-width:640px){.blog-design .gxb .grid3{grid-template-columns:minmax(0,1fr)}
.blog-design .gxb .search{width:100%}}
.blog-design .gxb .cvx{height:440px;border-radius:28px;background:radial-gradient(circle at 78% 22%,rgba(111,231,176,.35),transparent 45%),linear-gradient(140deg,#041f16,#0a5d3f 60%,#00a86b);display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding:34px;color:#fff;overflow:hidden;position:relative}
.blog-design .gxb .cvx .k{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:120px;line-height:.85;letter-spacing:-.05em;color:#6fe7b0}
.blog-design .gxb .cvx .k small{display:block;font-family:'Manrope',sans-serif;font-size:16px;letter-spacing:0;color:rgba(255,255,255,.8);font-weight:700;margin-top:12px}
.blog-design .gxb .cvx .ph{display:flex;flex-direction:column;gap:8px;width:330px}
.blog-design .gxb .cvx .ph div{padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);font-size:14px;font-weight:600;line-height:1.45}
.blog-design .gxb .cvx .ph div b{display:block;color:#6fe7b0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px}
@media (max-width:1000px){.blog-design .gxb .cvx .k{font-size:72px}
.blog-design .gxb .cvx .ph{display:none}}
.blog-design .gxb .share a{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;border:1px solid #e1e8e4;font-size:12px;font-weight:800;color:#2c3b33}
.blog-design .gxb .share a:hover{border-color:#00a86b;color:#0a5d3f}</style><div class="gxb">
<section class="bw" style="padding:56px 24px 36px">
<div class="eb">Blog · Outbound, explained</div>
<h1 class="bh1">How automated outbound actually works</h1>
<p class="blede">What a platform runs, what your team keeps, and what to check before you buy one.</p>
</section>
<section class="bw" style="padding-bottom:28px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center">
<div class="chips"><button type="button" class="chip on" data-cat="All">All</button><button type="button" class="chip" data-cat="Sales automation">Sales automation</button><button type="button" class="chip" data-cat="Agencies">Agencies</button><button type="button" class="chip" data-cat="Lead generation">Lead generation</button><button type="button" class="chip" data-cat="AI calls">AI calls</button></div>
<label class="search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" data-blog-search placeholder="Search articles" aria-label="Search articles" style="border:0;outline:0;flex:1;min-width:0;background:transparent;font:inherit;color:#0a1712"></label>
</section>
<section class="bw" style="padding-bottom:56px">
<a class="feat" href="/blog/ai-cold-calling-2026" style="color:#0a1712">
<div class="cvx" style="height:360px;padding:26px"><div class="k" style="font-size:96px">370<small>dials to book one meeting</small></div></div>
<div><div class="meta"><span class="tg">New today</span><span class="tg">Part 4 of 4</span><span>Oct 27, 2026 · 14 min read</span></div>
<div class="ft">AI Cold Calling in 2026: Is It Legal, Does It Work, and When Should a Startup Use It?</div><p class="fx">AI cold calling is not banned in the US, but consent rules apply. It works when you place calls well, not just more of them. Here is the data, the law and a 30-day pilot.</p>
<div class="au"><span class="av">ST</span><span>Simha Teja</span></div>
<span class="rl">Read the article →</span></div>
</a>
</section>
<section class="bw" style="padding-bottom:56px">
<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:22px"><h2 style="margin:0;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:28px;letter-spacing:-.02em">The outbound series</h2><span style="color:#69786f;font-size:13px;font-weight:700">Four parts, one workflow</span></div>
<div class="grid3" style="grid-template-columns:repeat(4,minmax(0,1fr))"><a class="card" data-tags="Sales automation" href="/blog/what-is-a-sales-automation-platform"><div class="cover c2"><span>Part 1</span></div><div class="meta"><span class="tg">Part 1</span><span>7 min read</span></div><h3>What Is a Sales Automation Platform?</h3><p>What it runs, what it is not, and what your team keeps control of.</p></a><a class="card" data-tags="Agencies" href="/blog/sales-automation-for-marketing-agencies"><div class="cover c3"><span>Part 2</span></div><div class="meta"><span class="tg">Part 2</span><span>7 min read</span></div><h3>Sales Automation for Marketing Agencies</h3><p>Why agency pipelines stall, and what automation fixes.</p></a><a class="card" data-tags="Lead generation" href="/blog/how-to-automate-lead-generation"><div class="cover c5"><span>Part 3</span></div><div class="meta"><span class="tg">Part 3</span><span>9 min read</span></div><h3>How to Automate Lead Generation, Enrichment, Follow-ups and Cold Calling</h3><p>The four stages of outbound, in the order that works.</p></a><a class="card" data-tags="AI calls" href="/blog/ai-cold-calling-2026"><div class="cover c1"><span>Part 4</span></div><div class="meta"><span class="tg">Part 4</span><span>14 min read</span></div><h3>AI Cold Calling in 2026</h3><p>Is it legal, does it work, and when should a startup use it?</p></a></div>
</section>
<section class="bw" style="padding-bottom:80px"><div class="nl"><div><h2>See it on your own ICP</h2><p>We can build a campaign with you and show you the leads and workflow on a live account.</p></div><a class="btp" href="https://cal.com/gnx-sales/30mins-meeting" target="_blank" rel="noopener noreferrer">Book a 30-minute walkthrough</a></div></section>
</div>`;
