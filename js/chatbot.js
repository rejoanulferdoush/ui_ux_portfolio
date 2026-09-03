/* ============================================================
   Ask Rejoanul — a sticky, self-contained portfolio assistant.

   No backend, no API key. The "training" is a hand-written
   knowledge base built from everything on this portfolio:
   the four case studies (SAFE, Prime Bank Digital Token, NMS,
   DCIM) in depth, the intro video, the design approach, the
   full tool stack (and what each tool is actually used for),
   every domain shipped (ERP, CRM, HRMS, POS, KDS, CDS, Kiosk,
   SMS + Email marketing solutions, EdTech, Job Portal, Edu
   portal, SaaS, eCommerce, websites & landing pages), the work
   done at every company, the international clients served
   (Canada, Australia, USA, UAE, Pakistan, Nigeria, Rwanda),
   education and contact details.

   A lightweight keyword-scoring matcher picks the best answer.
   Everything is in English.
   ============================================================ */
(function () {
  'use strict';

  var AVATAR = 'assets/mine2.png';
  var EMAIL = 'rejoanulferdoush@gmail.com';
  var PHONE_PRETTY = '+880 1627-647942';
  var PHONE_RAW = '+8801627647942';
  var RESUME = 'https://drive.google.com/file/d/1JJXKkSYM4AgdVSk-zB2cIQozw0DpkMTV/view?usp=sharing';

  /* ---------- Knowledge base ---------------------------------- */
  /* Each topic: id, patterns (keywords / phrases), answer (HTML),
     chips (follow-up suggestions). Order only matters for ties. */
  var KB = [
    /* ---- Who ---- */
    {
      id: 'about',
      patterns: ['who are you', 'who is rejoanul', 'about yourself', 'about you', 'about rejoanul', 'introduce yourself', 'tell me about yourself', 'tell me about rejoanul', 'tell me about him', 'your bio', 'about him', 'who r u', 'what do you do'],
      answer:
        '<p>I\'m <strong>Rejoanul Ferdoush</strong> — a <strong>UI/UX Engineer</strong> based in Dhaka, Bangladesh, with <strong>7+ years</strong> turning rough ideas into polished, working interfaces.</p>' +
        '<p>I design the whole experience <em>and</em> build the front-end myself, so the details survive all the way to production. Currently open to collaborate.</p>',
      chips: [
        { label: 'Show me your projects', q: 'show me your work' },
        { label: 'Your experience', q: 'tell me about your experience' },
        { label: 'Tools you use', q: 'what tools do you use' }
      ]
    },

    /* ---- Work ---- */
    {
      id: 'work',
      patterns: ['work', 'project', 'projects', 'case study', 'case studies', 'portfolio piece', 'featured', 'show me your work', 'best work', 'recent work', 'what have you built', 'what have you made'],
      answer:
        '<p>Four in-depth case studies — <a href="#work">jump to the Work section</a>, and each has its own full write-up:</p>' +
        '<ul>' +
        '<li><strong>SAFE</strong> — AI-powered home-security iOS app: a house full of gas, intrusion &amp; camera sensors read as one calm feed, with a three-state colour language and an escalation chain that runs itself. <a href="safe-home.html">Case study →</a></li>' +
        '<li><strong>Prime Bank Digital Token</strong> — FinTech branch-queue redesign: pick a branch, check in from the pavement in four taps, hold a live token that tracks itself to the counter. <a href="prime-bank-token.html">Case study →</a></li>' +
        '<li><strong>NMS</strong> — Network Monitoring System for a Dhaka bank, told as one night on the NOC: real-time topology, a device-state ladder and 99.9% uptime tracking <em>(★ IT Expo 2025)</em>. <a href="nms-system.html">Case study →</a></li>' +
        '<li><strong>DCIM</strong> — Data-Centre Infrastructure Monitoring for Dhaka Bank: five vendor consoles folded into one owned pane — power chain, cooling, PUE, capacity <em>(★ IT Expo 2025)</em>. <a href="dcim-system.html">Case study →</a></li>' +
        '</ul>' +
        '<p>There\'s also a short <a href="#top">intro video</a> on the home page, and NDA client work across POS, ERP, CRM, HRMS and more.</p>',
      chips: [
        { label: 'Tell me about SAFE', q: 'tell me about SAFE' },
        { label: 'What is NMS?', q: 'what is NMS' },
        { label: 'Prime Bank Token', q: 'tell me about prime bank digital token' },
        { label: 'What is DCIM?', q: 'what is DCIM' },
        { label: 'Watch the intro video', q: 'do you have an intro video' }
      ]
    },
    {
      id: 'proj-safe',
      patterns: ['safe', 'safe app', 'safe case study', 'home security', 'security app', 'gas leak', 'gas leak app', 'smart home', 'intrusion', 'home security app', 'iot app', 'sensor app', 'camera alerts', 'safe home'],
      answer:
        '<p><strong>SAFE — AI Home-Security App</strong> (iOS, 2025). A house fills up with sensors — gas, smoke/CO, motion, door contacts, cameras, air quality — and SAFE reads all of it as <strong>one calm feed</strong> instead of three apps giving three verdicts.</p>' +
        '<p>The core ideas:</p>' +
        '<ul>' +
        '<li><strong>Colour is the interface</strong> — one three-state language: Safe (green), Warning (amber), Emergency (red full-screen takeover).</li>' +
        '<li><strong>Quiet by default</strong> — the app only speaks in a crisis; a good day shows &ldquo;3 rooms · all clear&rdquo;.</li>' +
        '<li><strong>Escalate without me</strong> — a three-tier chain (SMS → call contacts → proof of life) that runs whether or not anyone is looking at the phone.</li>' +
        '<li><strong>Readable under stress</strong> — big type, high contrast, the emergency path never more than two taps away.</li>' +
        '</ul>' +
        '<p>Shipped as a system: a reusable device model, 32 screens across onboarding / home / rooms / sensors / cameras / alerts / settings, and a live Figma prototype embedded in the write-up. <a href="safe-home.html">Read the full case study →</a></p>',
      chips: [
        { label: 'Prime Bank Token', q: 'tell me about prime bank digital token' },
        { label: 'What is NMS?', q: 'what is NMS' },
        { label: 'Your design approach', q: 'what is your design approach' }
      ]
    },
    {
      id: 'proj-primebank',
      patterns: ['prime bank', 'primebank', 'digital token', 'prime bank token', 'queue', 'branch queue', 'token app', 'queue app', 'qr service', 'fintech', 'fintech project', 'banking', 'bank app', 'branch check in', 'serial app'],
      answer:
        '<p><strong>Prime Bank Digital Token</strong> (FinTech, 2025) — a redesign, not a new build. Prime Bank already had a branch-queue app, but customers opened it, lost the thread, and phoned the branch anyway to ask &ldquo;how long is the wait?&rdquo;</p>' +
        '<p>The redesign starts from what a token actually is — <em>a promise you\'ll be served in order</em> — and makes only that legible:</p>' +
        '<ul>' +
        '<li><strong>Four taps from the street</strong> — branch (sorted by distance + live wait) → customer or bearer → service → phone OTP → a live token in hand.</li>' +
        '<li><strong>One screen replaces the waiting room</strong> — your number, how many are ahead, and when to start walking; SMS + email nudges before your turn.</li>' +
        '<li><strong>The queue has to feel fair</strong> — one live token per person, positions never change silently, a missed turn is held once and slotted back three rather than dropped.</li>' +
        '<li>Plus the &ldquo;unglamorous&rdquo; screens a bank needs to trust it — OTP, errors, edge cases.</li>' +
        '</ul>' +
        '<p><a href="prime-bank-token.html">Read the full case study →</a></p>',
      chips: [
        { label: 'Tell me about SAFE', q: 'tell me about SAFE' },
        { label: 'What is DCIM?', q: 'what is DCIM' },
        { label: 'FinTech experience?', q: 'what domains have you worked in' }
      ]
    },
    {
      id: 'proj-nms',
      patterns: ['nms', 'nms case study', 'network monitoring', 'network monitoring system', 'topology', 'topology map', 'uptime', 'noc', 'network dashboard', 'device monitoring'],
      answer:
        '<p><strong>NMS — Network Monitoring System</strong> (2025). Built for a bank in Dhaka to replace an imported platform that <strong>billed per device</strong> and made the simplest task a scavenger hunt.</p>' +
        '<p>The case study is told as <strong>one night on the NOC</strong> — scroll and the shift runs: quiet, an alert, a fix, a handover. What it shows:</p>' +
        '<ul>' +
        '<li><strong>The topology is the home screen</strong> — every device a node, every link coloured by health, the whole path on one canvas; break something and watch the failure propagate.</li>' +
        '<li><strong>A device-state ladder</strong> — why the red is worth trusting: hard thresholds (ICMP timeout, uptime &lt; 50%) vs. soft warnings.</li>' +
        '<li><strong>Everything to fix it is in the drawer</strong> — tap a node and the operator gets the full panel, not another app.</li>' +
        '<li><strong>Reports for the auditor</strong> — uptime, alert-response times, security events, bandwidth trends, on demand or scheduled.</li>' +
        '</ul>' +
        '<p>★ Shown at <strong>IT Expo 2025</strong>. <a href="nms-system.html">Read the full case study →</a></p>',
      chips: [
        { label: 'What is DCIM?', q: 'what is DCIM' },
        { label: 'Tell me about SAFE', q: 'tell me about SAFE' },
        { label: 'Do you design dashboards?', q: 'do you design dashboards' }
      ]
    },
    {
      id: 'proj-dcim',
      patterns: ['dcim', 'dcim case study', 'data center', 'data centre', 'data center monitoring', 'power flow', 'power chain', 'pue', 'ups status', 'cooling', 'ashrae', 'rack pdu', 'facility monitoring'],
      answer:
        '<p><strong>DCIM — Data-Centre Infrastructure Monitoring</strong> (2025), built for Dhaka Bank. Their facility ran on <strong>five vendors\' boxes</strong> — transfer switches, the UPS wall, precision coolers, rack PDUs, environment sensors — each with its own console, its own login, and its own licence renewal (priced <strong>per monitored point</strong>, in dollars, yearly). DCIM folds them into one screen the bank owns outright.</p>' +
        '<ul>' +
        '<li><strong>Facility verdict first</strong> — total power draw, active alarms, fleet uptime, PUE and cooling load across the top, then a real floor plan, then the fleet by device class.</li>' +
        '<li><strong>Follow the power, end to end</strong> — an interactive chain (grid → ATS → UPS → PDU → rack, generator and coolers off it); inject a fault and watch the ATS transfer and the UPS carry the load.</li>' +
        '<li><strong>The room that can\'t get hot</strong> — ASHRAE A1 banding, ΔT, dew point, hotspots, airflow balance, water-leak rope.</li>' +
        '<li><strong>One page shape for five device classes</strong> — same three tabs (Overview · Alarms/Events/Log · Report &amp; Export) whatever you open. One alarm log for 638 units; a report library with a scheduler.</li>' +
        '</ul>' +
        '<p>★ Shown at <strong>IT Expo 2025</strong>. <a href="dcim-system.html">Read the full case study →</a></p>',
      chips: [
        { label: 'What is NMS?', q: 'what is NMS' },
        { label: 'Prime Bank Token', q: 'tell me about prime bank digital token' },
        { label: 'Do you design dashboards?', q: 'do you design dashboards' }
      ]
    },
    {
      id: 'video',
      patterns: ['video', 'intro video', 'your video', 'showreel', 'show reel', 'reel', 'walkthrough video', 'introduction video', 'do you have a video', 'do you have an intro video', 'watch you', 'see you talk'],
      answer:
        '<p>Yes — there\'s a short <strong>intro video</strong> on the home page. The disc in the hero plays a muted preview on hover; click it and the full video opens with sound in a lightbox.</p>' +
        '<p>It\'s a quick personal introduction — who I am and how I work. <a href="portfolio.html#top">Open the home page and hit play →</a> For a deeper walkthrough of any specific project, I\'m happy to screen-share — email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.</p>',
      chips: [
        { label: 'Show me your work', q: 'show me your work' },
        { label: 'Your design approach', q: 'what is your approach' },
        { label: 'Contact details', q: 'how do I contact you' }
      ]
    },
    {
      id: 'dashboards',
      patterns: ['dashboard', 'dashboards', 'data viz', 'data visualization', 'data visualisation', 'charts', 'analytics ui', 'complex ui'],
      answer:
        '<p>Yes — data-heavy dashboards are a strong area for me. <strong>NMS</strong> (network topology &amp; uptime) and <strong>DCIM</strong> (power-flow, PUE, capacity) are both complex real-time monitoring UIs, and both were shown at <strong>IT Expo 2025</strong>. I also shipped dashboards across CRM, ERP and POS platforms.</p>',
      chips: [
        { label: 'What is NMS?', q: 'what is NMS' },
        { label: 'What is DCIM?', q: 'what is DCIM' }
      ]
    },

    /* ---- Approach ---- */
    {
      id: 'approach',
      patterns: ['approach', 'process', 'philosophy', 'how do you work', 'how do you design', 'methodology', 'workflow', 'principles', 'design approach', 'design process'],
      answer:
        '<p>Four principles guide every project — <a href="#approach">full section here</a>:</p>' +
        '<ul>' +
        '<li><strong>Start with the problem, not the pixels</strong> — research and constraints first.</li>' +
        '<li><strong>Design in systems, not screens</strong> — reusable components &amp; clear tokens.</li>' +
        '<li><strong>Ship, measure, refine</strong> — a real v1 beats a perfect mockup.</li>' +
        '<li><strong>Code is part of the design</strong> — I build the front-end so motion, spacing &amp; performance survive.</li>' +
        '</ul>',
      chips: [
        { label: 'Design systems', q: 'tell me about design systems' },
        { label: 'Do you write code?', q: 'do you write code' },
        { label: 'Your experience', q: 'tell me about your experience' }
      ]
    },

    /* ---- Stack overview ---- */
    {
      id: 'stack',
      patterns: ['stack', 'tools', 'technologies', 'toolkit', 'what tools', 'what tools do you use', 'tech stack', 'full toolkit', 'your tools', 'tools and tech', 'what software do you use', 'entire stack', 'whole stack'],
      answer:
        '<p>The tools I actually reach for — <a href="#stack">full breakdown here</a>:</p>' +
        '<ul>' +
        '<li><strong>Design:</strong> Figma, Sketch, Adobe XD, Miro, Photoshop, Illustrator</li>' +
        '<li><strong>Build:</strong> HTML5, CSS3, Tailwind, Bootstrap, JavaScript, React, Spline, Blender</li>' +
        '<li><strong>AI co-pilots:</strong> ChatGPT, Claude, Perplexity, Cursor, Codex, Midjourney, Firefly, v0, Notion</li>' +
        '<li><strong>UX research:</strong> Maze, Dovetail, Hotjar, Zapier</li>' +
        '<li><strong>DevOps / CI-CD:</strong> Azure DevOps, Jira, GitHub, GitLab, Bitbucket, JMeter, Postman</li>' +
        '</ul>' +
        '<p>Ask about any single tool and I\'ll tell you what I use it for.</p>',
      chips: [
        { label: 'What do you use Zapier for?', q: 'what do you use zapier for' },
        { label: 'What do you use Jira for?', q: 'what do you use jira for' },
        { label: 'How good are you at React?', q: 'how good are you at react' }
      ]
    },

    /* ---- Code / front-end ---- */
    {
      id: 'code',
      patterns: ['do you code', 'do you write code', 'can you code', 'front end', 'frontend', 'react', 'reactjs', 'html', 'css', 'tailwind', 'bootstrap', 'javascript', 'js', 'developer', 'development', 'design to code', 'coding', 'build the ui', 'responsive'],
      answer:
        '<p>Yes — I\'m a UI/UX Engineer, not just a designer. I ship production front-end in <strong>HTML5, CSS3, Tailwind and React</strong>, and I\'m fluent at turning Figma / XD / Sketch files into responsive, pixel-perfect builds.</p>' +
        '<p><strong>JavaScript</strong> for interactivity and animation, <strong>Bootstrap</strong> for fast admin/prototype work, and <strong>Spline / Blender</strong> when a project needs 3D. That\'s <em>&ldquo;code is part of the design&rdquo;</em> — <a href="#approach">see my approach</a>.</p>',
      chips: [
        { label: 'Design-to-code project?', q: 'what did you do at se plus global' },
        { label: 'Full stack list', q: 'what tools do you use' }
      ]
    },

    /* ---- Design tools ---- */
    {
      id: 'tool-figma',
      patterns: ['figma', 'sketch', 'adobe xd', 'xd', 'expert in figma', 'design tool', 'design tools', 'design software'],
      answer:
        '<p><strong>Figma</strong> is my primary tool — UI design, components and variants, auto-layout, interactive prototypes, design tokens and developer handoff. It\'s in my &ldquo;could use with my eyes closed&rdquo; tier.</p>' +
        '<p><strong>Sketch</strong> and <strong>Adobe XD</strong>: I move fluently between all three, mostly when a team or client already has files in them — I take XD/Sketch source and turn it into responsive React builds.</p>',
      chips: [
        { label: 'Design systems', q: 'tell me about design systems' },
        { label: 'Full toolkit', q: 'what tools do you use' }
      ]
    },
    {
      id: 'tool-miro',
      patterns: ['miro', 'whiteboard', 'workshop', 'journey map', 'user flow', 'user flows', 'affinity map', 'sitemap', 'brainstorm'],
      answer:
        '<p>I use <strong>Miro</strong> for the thinking that happens before screens: <strong>user flows, journey maps, sitemaps, affinity mapping</strong> of research notes, and remote workshops with stakeholders and engineers.</p>',
      chips: [
        { label: 'Your design approach', q: 'what is your approach' },
        { label: 'UX research', q: 'how do you do ux research' }
      ]
    },
    {
      id: 'tool-adobe',
      patterns: ['photoshop', 'illustrator', 'adobe', 'vector', 'icons', 'icon set', 'retouch', 'illustration', 'illustrations', 'assets'],
      answer:
        '<p><strong>Illustrator</strong> — vector icon sets, logos, spot illustrations and clean SVG assets for the build. <strong>Photoshop</strong> — image editing, mockup retouching, compositing and exporting production-ready raster assets.</p>',
      chips: [
        { label: 'Full toolkit', q: 'what tools do you use' },
        { label: 'AI tools for visuals', q: 'what do you use midjourney for' }
      ]
    },
    {
      id: 'tool-3d',
      patterns: ['spline', 'blender', '3d', 'three d', '3d model', '3d scene', 'webgl'],
      answer:
        '<p><strong>Spline</strong> — interactive 3D scenes for hero sections and landing pages, exported straight to the web. <strong>Blender</strong> — modeling and rendering product visuals, device mockups and marketing imagery when a flat asset isn\'t enough.</p>',
      chips: [
        { label: 'Do you write code?', q: 'do you write code' },
        { label: 'Full toolkit', q: 'what tools do you use' }
      ]
    },
    {
      id: 'tool-cms',
      patterns: ['wordpress', 'shopify', 'cms', 'ecommerce', 'e commerce', 'storefront', 'woocommerce', 'theme'],
      answer:
        '<p><strong>WordPress</strong> — CMS-driven marketing and content sites, theme customization and building editable layouts for clients. <strong>Shopify</strong> — e-commerce storefronts and theme customization, tuning the buying flow for conversion.</p>',
      chips: [
        { label: 'Full toolkit', q: 'what tools do you use' },
        { label: 'Your experience', q: 'tell me about your experience' }
      ]
    },

    /* ---- AI tools ---- */
    {
      id: 'ai-tools',
      patterns: ['ai tools', 'ai', 'chatgpt', 'gpt', 'claude', 'copilot', 'cursor', 'v0', 'firefly', 'perplexity', 'codex', 'ai workflow', 'which ai'],
      answer:
        '<p>AI is part of my daily workflow:</p>' +
        '<ul>' +
        '<li><strong>ChatGPT &amp; Claude</strong> — research, drafting UX copy, analyzing docs, code help</li>' +
        '<li><strong>Perplexity</strong> — fast, sourced research and competitive analysis</li>' +
        '<li><strong>Cursor &amp; Codex</strong> — AI-assisted coding, refactors, boilerplate</li>' +
        '<li><strong>v0</strong> — scaffolding UI quickly from a prompt for rapid prototyping</li>' +
        '<li><strong>Midjourney &amp; Adobe Firefly</strong> — concept imagery, moodboards, generative fills</li>' +
        '<li><strong>Notion</strong> — where all the research and specs live</li>' +
        '</ul>',
      chips: [
        { label: 'What do you use Notion for?', q: 'what do you use notion for' },
        { label: 'Full toolkit', q: 'what tools do you use' }
      ]
    },
    {
      id: 'tool-notion',
      patterns: ['notion', 'documentation', 'docs', 'specs', 'notes', 'knowledge base', 'research repo'],
      answer:
        '<p><strong>Notion</strong> is my second brain for projects: <strong>design specs, research notes and interview summaries, decision logs, component documentation</strong> and project trackers — a single source of truth the whole team can read.</p>',
      chips: [
        { label: 'AI tools', q: 'which ai tools do you use' },
        { label: 'UX research', q: 'how do you do ux research' }
      ]
    },
    {
      id: 'tool-midjourney',
      patterns: ['midjourney', 'firefly', 'image generation', 'generative image', 'moodboard', 'concept art'],
      answer:
        '<p><strong>Midjourney</strong> — early concept imagery, moodboards and visual direction before committing to a style. <strong>Adobe Firefly</strong> — generative fill and asset creation inside the Adobe workflow, so results drop straight into Photoshop / Illustrator.</p>',
      chips: [
        { label: 'AI tools', q: 'which ai tools do you use' },
        { label: 'Illustrator / Photoshop', q: 'what do you use photoshop for' }
      ]
    },

    /* ---- UX research & testing tools ---- */
    {
      id: 'ux-research',
      patterns: ['ux research', 'user research', 'usability', 'usability testing', 'user testing', 'research method', 'research tools', 'testing tools', 'interview', 'interviews', 'research process', 'research'],
      answer:
        '<p>I run research before pixels — user interviews, usability testing and behaviour analysis. The tools:</p>' +
        '<ul>' +
        '<li><strong>Maze</strong> — unmoderated usability tests &amp; prototype testing</li>' +
        '<li><strong>Dovetail</strong> — research repository &amp; insight synthesis</li>' +
        '<li><strong>Hotjar</strong> — heatmaps, session recordings, on-site surveys</li>' +
        '<li><strong>Zapier</strong> — automating the research ops around all of it</li>' +
        '</ul>',
      chips: [
        { label: 'What do you use Maze for?', q: 'what do you use maze for' },
        { label: 'What do you use Hotjar for?', q: 'what do you use hotjar for' },
        { label: 'Your approach', q: 'what is your approach' }
      ]
    },
    {
      id: 'tool-maze',
      patterns: ['maze', 'unmoderated', 'tree testing', 'prototype test', 'task success', 'first click'],
      answer:
        '<p><strong>Maze</strong> — I run <strong>unmoderated usability tests</strong> on Figma prototypes: task-success and drop-off rates, time-on-task, misclick maps, first-click and tree tests for navigation, plus quick preference surveys. It turns &ldquo;I think this flow is clearer&rdquo; into numbers.</p>',
      chips: [
        { label: 'What do you use Dovetail for?', q: 'what do you use dovetail for' },
        { label: 'Your approach', q: 'what is your approach' }
      ]
    },
    {
      id: 'tool-dovetail',
      patterns: ['dovetail', 'research repository', 'transcripts', 'tagging', 'synthesis', 'insights', 'affinity'],
      answer:
        '<p><strong>Dovetail</strong> — my research repository. I store interview and test recordings, <strong>tag and code transcripts</strong>, cluster observations into themes, and publish shareable insight summaries so findings don\'t die in a doc nobody opens.</p>',
      chips: [
        { label: 'What do you use Maze for?', q: 'what do you use maze for' },
        { label: 'What do you use Notion for?', q: 'what do you use notion for' }
      ]
    },
    {
      id: 'tool-hotjar',
      patterns: ['hotjar', 'heatmap', 'heatmaps', 'session recording', 'session replay', 'scroll map', 'funnel', 'on site survey'],
      answer:
        '<p><strong>Hotjar</strong> — behaviour on live products: <strong>click and scroll heatmaps</strong>, session recordings to see where people get stuck, <strong>funnel analysis</strong> for drop-off, and short on-site surveys to catch the &ldquo;why&rdquo; behind the numbers.</p>',
      chips: [
        { label: 'What do you use Maze for?', q: 'what do you use maze for' },
        { label: 'Your approach', q: 'what is your approach' }
      ]
    },
    {
      id: 'tool-zapier',
      patterns: ['zapier', 'automation', 'automate', 'no code', 'nocode', 'integration', 'integrations', 'workflow automation', 'webhook'],
      answer:
        '<p><strong>Zapier</strong> — I automate the glue work around design and research: push <strong>form and survey responses into a research sheet or Notion</strong>, post <strong>new feedback and usability results into Slack</strong>, sync tasks between Jira / Azure DevOps and a design tracker, and trigger notifications when a test finishes — all no-code, so I don\'t babysit it.</p>',
      chips: [
        { label: 'What do you use Hotjar for?', q: 'what do you use hotjar for' },
        { label: 'DevOps tools', q: 'what devops tools do you use' }
      ]
    },

    /* ---- DevOps / CI-CD tools ---- */
    {
      id: 'devops-tools',
      patterns: ['devops', 'dev ops', 'ci cd', 'cicd', 'pipeline', 'pipelines', 'version control', 'ci', 'deployment', 'devops tools'],
      answer:
        '<p>Where design meets deployment — <a href="#stack">full section here</a>:</p>' +
        '<ul>' +
        '<li><strong>Azure DevOps</strong> — boards, backlog &amp; sprint planning, repos and pipelines</li>' +
        '<li><strong>Jira</strong> — issue tracking, sprint boards, linking design tickets to dev work</li>' +
        '<li><strong>GitHub / GitLab / Bitbucket</strong> — version control &amp; pull requests for front-end code</li>' +
        '<li><strong>JMeter</strong> — load &amp; performance testing</li>' +
        '<li><strong>Postman</strong> — testing and inspecting APIs during front-end integration</li>' +
        '</ul>',
      chips: [
        { label: 'What do you use Jira for?', q: 'what do you use jira for' },
        { label: 'What do you use JMeter for?', q: 'what do you use jmeter for' },
        { label: 'What do you use Postman for?', q: 'what do you use postman for' }
      ]
    },
    {
      id: 'tool-jira',
      patterns: ['jira', 'sprint', 'backlog', 'issue tracking', 'tickets', 'agile', 'scrum', 'kanban', 'bug triage'],
      answer:
        '<p><strong>Jira</strong> — I work the sprint from the design side: <strong>create and groom design tickets</strong>, link them to the dev stories they unblock, attach specs and prototypes, run <strong>bug triage</strong> on UI issues, and track a design QA column so nothing ships off-spec.</p>',
      chips: [
        { label: 'What do you use Azure DevOps for?', q: 'what do you use azure devops for' },
        { label: 'DevOps tools', q: 'what devops tools do you use' }
      ]
    },
    {
      id: 'tool-azure',
      patterns: ['azure devops', 'azure', 'ado', 'azure boards', 'azure pipelines', 'azure repos'],
      answer:
        '<p><strong>Azure DevOps</strong> — for teams on the Microsoft stack I run the same design workflow through <strong>Boards</strong> (backlog, sprint planning, design tasks alongside dev), commit front-end code to <strong>Repos</strong>, and follow builds through <strong>Pipelines</strong> so I know when a change is live to test.</p>',
      chips: [
        { label: 'What do you use Jira for?', q: 'what do you use jira for' },
        { label: 'DevOps tools', q: 'what devops tools do you use' }
      ]
    },
    {
      id: 'tool-git',
      patterns: ['github', 'gitlab', 'bitbucket', 'git', 'pull request', 'pull requests', 'pr', 'repo', 'repository', 'branch', 'merge'],
      answer:
        '<p><strong>GitHub, GitLab and Bitbucket</strong> — I version my own front-end code, work in feature branches, open <strong>pull requests</strong> and review UI changes, and keep design-token and component updates in sync with the codebase. Which one depends on the team\'s stack.</p>',
      chips: [
        { label: 'Do you write code?', q: 'do you write code' },
        { label: 'DevOps tools', q: 'what devops tools do you use' }
      ]
    },
    {
      id: 'tool-jmeter',
      patterns: ['jmeter', 'load testing', 'load test', 'performance testing', 'stress test', 'throughput', 'concurrency'],
      answer:
        '<p><strong>JMeter</strong> — <strong>load and performance testing</strong>. I use it to see how a UI and its endpoints hold up under concurrent users — response times, throughput, where things degrade — so performance problems are caught before they reach real users, not after.</p>',
      chips: [
        { label: 'What do you use Postman for?', q: 'what do you use postman for' },
        { label: 'DevOps tools', q: 'what devops tools do you use' }
      ]
    },
    {
      id: 'tool-postman',
      patterns: ['postman', 'api', 'apis', 'endpoint', 'endpoints', 'rest', 'json', 'payload', 'api testing'],
      answer:
        '<p><strong>Postman</strong> — during front-end integration I use it to <strong>hit endpoints, inspect JSON payloads, check status codes and edge cases</strong>, and confirm the API returns what the UI expects before wiring it in. It saves a lot of guesswork when a screen isn\'t rendering the right data.</p>',
      chips: [
        { label: 'What do you use JMeter for?', q: 'what do you use jmeter for' },
        { label: 'Do you write code?', q: 'do you write code' }
      ]
    },

    /* ---- Experience ---- */
    {
      id: 'experience',
      patterns: ['experience', 'career', 'job', 'jobs', 'work history', 'companies', 'employment', 'how many years', 'years of experience', 'cv history', 'background', 'worked where', 'past roles'],
      answer:
        '<p><strong>7+ years</strong>, <strong>20 flagship products</strong>, <strong>6 companies across 3 countries</strong> — <a href="#experience">full timeline here</a>.</p>' +
        '<ul>' +
        '<li><strong>ADN DigiNet Limited</strong> — UI/UX Engineer, Dhaka (Nov 2021 – Jul 2026)</li>' +
        '<li><strong>SE Plus Global</strong> — UI/UX Engineer, part-time, Thailand-based remote (Oct 2024 – Dec 2025)</li>' +
        '<li><strong>Streaming Plug</strong> — UI/UX Engineer, Florida USA remote (Jan 2021 – Jan 2022)</li>' +
        '<li><strong>Sam Solutions</strong> — System Analyst, Dhaka (Feb 2020 – Jan 2021)</li>' +
        '<li><strong>Future Track IT</strong> — Product Designer, Dhaka (Jan 2018 – Mar 2019)</li>' +
        '<li><strong>Earlier</strong> — data &amp; CRM roles (2015 – 2017)</li>' +
        '</ul>' +
        '<p>Beyond employers, I\'ve designed and shipped work for <strong>international companies and clients across Canada, Australia, the USA, the UAE, Pakistan, Nigeria and Rwanda</strong> — all remote, from Dhaka.</p>' +
        '<p>Ask about any one of them and I\'ll tell you what I did there.</p>',
      chips: [
        { label: 'What did you do at ADN?', q: 'what did you do at adn diginet' },
        { label: 'What did you do at SE Plus?', q: 'what did you do at se plus global' },
        { label: 'Which domains?', q: 'what domains have you worked in' }
      ]
    },
    {
      id: 'exp-adn',
      patterns: ['adn', 'diginet', 'adn diginet', 'current job', 'current company', 'where do you work now', 'latest job'],
      answer:
        '<p><strong>ADN DigiNet Limited</strong> — Mohakhali, Dhaka · <strong>UI/UX Engineer</strong> (Nov 2021 – Jul 2026).</p>' +
        '<p>I own <strong>end-to-end product design for web and app products</strong>: discovery and requirements, wireframes and user flows, high-fidelity UI, and shared <strong>design systems</strong> — then I stay with engineering through implementation to keep the build on-spec. I also help set product direction across ERP, CRM, HRMS, POS, KDS/CDS, kiosk and FinTech products.</p>' +
        '<p>Focus: Product Strategy · Design Systems · Cross-functional Leadership.</p>',
      chips: [
        { label: 'Full timeline', q: 'tell me about your experience' },
        { label: 'Design systems', q: 'tell me about design systems' }
      ]
    },
    {
      id: 'exp-seplus',
      patterns: ['se plus', 'seplus', 'se plus global', 'thailand', 'part time', 'part-time'],
      answer:
        '<p><strong>SE Plus Global</strong> — remote, Thailand-based · <strong>UI/UX Engineer (part-time)</strong> (Oct 2024 – Dec 2025).</p>' +
        '<p>I designed user-focused UI/UX for <strong>POS web and app products</strong>, then did the build myself — taking <strong>Figma, XD and Sketch</strong> files and turning them into responsive, <strong>pixel-perfect React</strong>. Classic design-to-code ownership.</p>',
      chips: [
        { label: 'How good are you at React?', q: 'how good are you at react' },
        { label: 'Full timeline', q: 'tell me about your experience' }
      ]
    },
    {
      id: 'exp-streaming',
      patterns: ['streaming plug', 'streamingplug', 'florida', 'usa job', 'us company'],
      answer:
        '<p><strong>Streaming Plug</strong> — remote, Florida, USA · <strong>UI/UX Engineer</strong> (Jan 2021 – Jan 2022).</p>' +
        '<p>I created <strong>user-centered designs from research and feedback</strong> — wireframes, prototypes and mockups — and fixed a backlog of <strong>UX and responsiveness issues</strong> across the product.</p>',
      chips: [
        { label: 'Full timeline', q: 'tell me about your experience' },
        { label: 'UX research', q: 'how do you do ux research' }
      ]
    },
    {
      id: 'exp-sam',
      patterns: ['sam solutions', 'system analyst', 'systems analyst', 'analyst role', 'linux', 'server admin'],
      answer:
        '<p><strong>Sam Solutions</strong> — Mirpur DOHS, Dhaka · <strong>System Analyst</strong> (Feb 2020 – Jan 2021).</p>' +
        '<p>I <strong>gathered requirements and specifications</strong> for new systems, <strong>validated results through testing</strong>, and handled <strong>Linux server administration</strong>. It\'s where the engineering side of my thinking got sharper.</p>',
      chips: [
        { label: 'Full timeline', q: 'tell me about your experience' },
        { label: 'Your education', q: 'tell me about your education' }
      ]
    },
    {
      id: 'exp-futuretrack',
      patterns: ['future track', 'futuretrack', 'future track it', 'product designer', 'first design job', 'earliest role'],
      answer:
        '<p><strong>Future Track IT</strong> — Mirpur, Dhaka · <strong>Product Designer</strong> (Jan 2018 – Mar 2019).</p>' +
        '<p>I built <strong>wireframes, user flows and high-fidelity UI from business requirements</strong>, and contributed to the team\'s shared <strong>design systems</strong>. This is where the UI/UX career really started.</p>',
      chips: [
        { label: 'Full timeline', q: 'tell me about your experience' },
        { label: 'Design systems', q: 'tell me about design systems' }
      ]
    },
    {
      id: 'exp-early',
      patterns: ['dailytask24', 'daily task', 'mapquest', 'aspire', 'virtual assistant', 'data analyst', 'map data', 'web scraping', 'before design', '2015'],
      answer:
        '<p><strong>2015 – 2017</strong> — before design: <strong>web scraping and CRM operations</strong> at DailyTask24, <strong>map data verification</strong> at MapQuest, and <strong>virtual assistance</strong> for The ASPIRE Group. Detail-heavy data work that still shows up in how carefully I handle edge cases.</p>',
      chips: [
        { label: 'Full timeline', q: 'tell me about your experience' },
        { label: 'Your education', q: 'tell me about your education' }
      ]
    },
    /* ---- Domain expertise ---- */
    {
      id: 'dom-erp',
      patterns: ['erp', 'enterprise resource planning', 'erp system', 'erp platform', 'resource planning'],
      answer:
        '<p>Yes — <strong>ERP</strong> is one of my core domains. I\'ve designed and front-end-built <strong>enterprise resource planning</strong> modules end to end: inventory &amp; procurement, finance and invoicing, sales orders, manufacturing / BOM, reporting and role-based admin.</p>' +
        '<p>The hard part of ERP is <strong>density without chaos</strong> — I lean on a strict design system, smart data tables (bulk actions, inline edit, saved views, column control), predictable form patterns, and permission-aware screens so each role only sees what it needs.</p>',
      chips: [
        { label: 'CRM work?', q: 'have you worked on CRM' },
        { label: 'Complex enterprise UX', q: 'how do you design complex enterprise software' },
        { label: 'Design systems', q: 'tell me about design systems' }
      ]
    },
    {
      id: 'dom-crm',
      patterns: ['crm', 'customer relationship management', 'crm system', 'crm platform', 'sales pipeline', 'lead management'],
      answer:
        '<p><strong>CRM</strong> — a domain I\'ve shipped in repeatedly, and where my career actually started (CRM operations, 2015–2017). I\'ve designed <strong>contact and account management, sales pipelines &amp; deal stages, activity timelines, lead scoring, task / email workflows and analytics dashboards</strong>.</p>' +
        '<p>Focus: a fast <strong>global search</strong>, drag-and-drop pipeline boards, quick-add everywhere, and dashboards that answer &ldquo;what needs my attention today&rdquo; instead of just showing charts.</p>',
      chips: [
        { label: 'ERP work?', q: 'have you worked on ERP' },
        { label: 'HRMS work?', q: 'have you worked on HRMS' },
        { label: 'Dashboards', q: 'do you design dashboards' }
      ]
    },
    {
      id: 'dom-hrms',
      patterns: ['hrms', 'hris', 'hr system', 'human resource', 'human resources', 'payroll', 'attendance', 'leave management', 'employee management', 'onboarding'],
      answer:
        '<p><strong>HRMS / HRIS</strong> — yes. I\'ve designed <strong>employee directories &amp; profiles, attendance and shift tracking, leave requests and approval flows, payroll views, onboarding checklists, performance reviews and org charts</strong>.</p>' +
        '<p>HR software runs from a power admin to a first-day employee, so I design <strong>two experiences in one</strong>: a dense console for HR, and a simple self-service portal for staff — with approval flows that are obvious at a glance.</p>',
      chips: [
        { label: 'CRM work?', q: 'have you worked on CRM' },
        { label: 'Enterprise UX', q: 'how do you design complex enterprise software' },
        { label: 'Your experience', q: 'tell me about your experience' }
      ]
    },
    {
      id: 'dom-pos',
      patterns: ['pos', 'point of sale', 'point-of-sale', 'pos system', 'pos app', 'retail pos', 'restaurant pos', 'billing screen', 'checkout screen', 'cashier'],
      answer:
        '<p><strong>POS</strong> is a strong area — I designed and front-end-built <strong>POS web and app products at SE Plus Global</strong>, plus more at ADN DigiNet.</p>' +
        '<p>POS UX is about <strong>speed under pressure</strong>: large touch targets, a cart that never hides, one- or two-tap item entry, fast modifiers and combos, split / merge bills, offline-tolerant flows, and a checkout a new cashier can run on day one. Hardware counts too — receipt printers, cash drawers, scanners, card terminals.</p>',
      chips: [
        { label: 'What is a KDS?', q: 'what is a KDS' },
        { label: 'What is a CDS?', q: 'what is a CDS' },
        { label: 'Kiosk work?', q: 'have you designed a kiosk' }
      ]
    },
    {
      id: 'dom-kds',
      patterns: ['kds', 'kitchen display', 'kitchen display system', 'kitchen screen', 'order display', 'expo screen', 'ticket rail', 'bump bar'],
      answer:
        '<p><strong>KDS — Kitchen Display System.</strong> The kitchen screen that replaces paper tickets: orders route to the right station with <strong>prep timers, colour-coded urgency, course firing, bump / recall and all-day item counts</strong>.</p>' +
        '<p>I design KDS to be readable from across a hot, busy kitchen — <strong>huge type, high contrast, no tiny controls</strong>, driven by a bump bar or a few big touch zones. It pairs with the POS and CDS as one connected system.</p>',
      chips: [
        { label: 'What is a CDS?', q: 'what is a CDS' },
        { label: 'POS work?', q: 'have you worked on POS' },
        { label: 'Kiosk work?', q: 'have you designed a kiosk' }
      ]
    },
    {
      id: 'dom-cds',
      patterns: ['cds', 'customer display', 'customer display system', 'customer facing display', 'second screen', 'pole display', 'order confirmation screen'],
      answer:
        '<p><strong>CDS — Customer Display System.</strong> The customer-facing screen at the counter: it mirrors the cart live as the cashier rings items, showing <strong>line items, discounts, tax and totals</strong>, then payment status, loyalty prompts and a thank-you / feedback QR.</p>' +
        '<p>I design CDS to <strong>build trust and cut disputes</strong> — the customer sees exactly what\'s being charged, in clean large type, with room for promos or branding between transactions.</p>',
      chips: [
        { label: 'What is a KDS?', q: 'what is a KDS' },
        { label: 'POS work?', q: 'have you worked on POS' },
        { label: 'Kiosk work?', q: 'have you designed a kiosk' }
      ]
    },
    {
      id: 'dom-kiosk',
      patterns: ['kiosk', 'self service', 'self-service', 'self ordering', 'self-order', 'self checkout', 'self-checkout', 'ordering kiosk', 'touchscreen kiosk', 'unattended'],
      answer:
        '<p><strong>Kiosk / self-service</strong> — yes, shipped as a flagship domain: self-order and self-checkout kiosks for retail and restaurants.</p>' +
        '<p>Kiosks have their own rules — <strong>no keyboard, no help desk</strong>. Big obvious steps, a persistent progress and cart, forgiving touch targets, generous timeouts with an &ldquo;are you still there?&rdquo; reset, real accessibility (reachable height, screen-reader / high-contrast mode), attract-loop screens, and a flow a first-timer finishes without instructions.</p>',
      chips: [
        { label: 'POS work?', q: 'have you worked on POS' },
        { label: 'What is a KDS?', q: 'what is a KDS' },
        { label: 'Accessibility', q: 'do you do accessibility' }
      ]
    },
    {
      id: 'dom-saas',
      patterns: ['saas', 'saas product', 'saas platform', 'b2b saas', 'subscription product', 'web app product', 'multi tenant', 'multi-tenant'],
      answer:
        '<p><strong>SaaS products</strong> — a big part of my work: multi-tenant B2B web apps from first screen to scale.</p>' +
        '<p>I cover the whole SaaS surface: <strong>onboarding and empty states, role &amp; permission models, billing and plan limits, settings, in-app notifications, dashboards and reporting</strong> — plus the design system that keeps it coherent as it grows. I design it <em>and</em> build the React front-end, so it ships as drawn.</p>',
      chips: [
        { label: 'Design systems', q: 'tell me about design systems' },
        { label: 'How good are you at React?', q: 'how good are you at react' },
        { label: 'Your projects', q: 'show me your work' }
      ]
    },
    {
      id: 'dom-website',
      patterns: ['website', 'websites', 'web design', 'landing page', 'landing pages', 'marketing site', 'marketing website', 'company website', 'corporate website', 'web page', 'webpage', 'design a website', 'build a website', 'portfolio site'],
      answer:
        '<p>Absolutely — <strong>website design and build</strong> is bread and butter: marketing and corporate sites, <strong>landing pages</strong>, product sites and portfolios.</p>' +
        '<p>End to end: <strong>UX and IA, visual design, responsive layout, motion, SEO-friendly semantic markup, and the front-end build</strong> in HTML5 / CSS3 / Tailwind / React — or WordPress / Shopify when a CMS or store fits. This very site is a hand-built example: no template, custom motion, even the chat window.</p>' +
        '<p>A <strong>landing page</strong> specifically: one goal, one message, a fast page tuned for conversion — hero, proof, objection-handling, one clear CTA, A/B-ready.</p>',
      chips: [
        { label: 'eCommerce work?', q: 'have you done ecommerce' },
        { label: 'Do you write code?', q: 'do you write code' },
        { label: 'WordPress / Shopify?', q: 'do you use wordpress' }
      ]
    },
    {
      id: 'dom-ecommerce',
      patterns: ['ecommerce', 'e commerce', 'e-commerce', 'online store', 'online shop', 'shopping site', 'storefront', 'checkout flow', 'cart', 'product page', 'pdp', 'plp', 'shopify store', 'woocommerce', 'have you done ecommerce'],
      answer:
        '<p><strong>eCommerce</strong> — yes, shipped as a flagship domain: full online stores and storefronts.</p>' +
        '<p>The whole buying surface: <strong>catalogue and search, product listing &amp; detail pages, filters, cart and mini-cart, a short checkout, account and order history, wishlist, and the CMS side for merchandising</strong>. Built custom in React or on <strong>Shopify / WooCommerce</strong> when a platform fits. Focus is always the same — cut friction between &ldquo;I want this&rdquo; and &ldquo;order placed&rdquo;, and make it fast on a mid-range phone.</p>',
      chips: [
        { label: 'Landing pages / websites', q: 'do you build websites' },
        { label: 'WordPress / Shopify?', q: 'do you use wordpress' },
        { label: 'Which domains?', q: 'what domains have you worked in' }
      ]
    },
    {
      id: 'dom-sms-marketing',
      patterns: ['sms marketing', 'sms platform', 'sms solution', 'sms campaign', 'bulk sms', 'sms gateway', 'text marketing', 'sms blast', 'otp platform', 'sms full solution'],
      answer:
        '<p>Yes — I designed and front-end-built a <strong>full SMS marketing solution</strong>: an end-to-end platform, not just a send box.</p>' +
        '<ul>' +
        '<li><strong>Campaign builder</strong> — compose, personalise with merge fields, character/segment counter, sender-ID management, schedule or drip.</li>' +
        '<li><strong>Contacts &amp; segments</strong> — import, dedupe, opt-in / opt-out and DND handling, dynamic segments.</li>' +
        '<li><strong>Delivery &amp; billing</strong> — gateway routing, delivery-report dashboards, per-message cost, wallet / credit top-up.</li>' +
        '<li><strong>Transactional + OTP APIs</strong>, templates and approval, plus reporting on delivery rate, cost and click-through.</li>' +
        '</ul>' +
        '<p>The design challenge is density with a calm campaign flow — a marketer and an admin using the same product very differently.</p>',
      chips: [
        { label: 'Email marketing solution?', q: 'have you built an email marketing platform' },
        { label: 'SaaS work', q: 'have you designed saas products' },
        { label: 'Which domains?', q: 'what domains have you worked in' }
      ]
    },
    {
      id: 'dom-email-marketing',
      patterns: ['email marketing', 'email platform', 'email campaign', 'newsletter tool', 'email automation', 'drip campaign', 'email builder', 'mailer', 'email full solution', 'email blast', 'email solution'],
      answer:
        '<p>Yes — a <strong>full email marketing solution</strong>, designed and front-end-built end to end.</p>' +
        '<ul>' +
        '<li><strong>Drag-and-drop email builder</strong> — blocks, reusable templates, live desktop/mobile preview, merge tags, dark-mode check.</li>' +
        '<li><strong>Automation / journeys</strong> — a visual flow canvas: triggers, waits, conditions, A/B splits.</li>' +
        '<li><strong>Lists &amp; deliverability</strong> — signup forms, double opt-in, suppression &amp; bounce handling, sender authentication (SPF/DKIM), warm-up.</li>' +
        '<li><strong>Analytics</strong> — opens, clicks, heat map, revenue attribution, per-campaign and per-contact.</li>' +
        '</ul>' +
        '<p>It pairs with the SMS platform as one multi-channel campaign product.</p>',
      chips: [
        { label: 'SMS marketing solution?', q: 'have you built an sms marketing platform' },
        { label: 'SaaS work', q: 'have you designed saas products' },
        { label: 'Which domains?', q: 'what domains have you worked in' }
      ]
    },
    {
      id: 'dom-edtech',
      patterns: ['edtech', 'ed tech', 'e learning', 'elearning', 'lms', 'learning management', 'online course', 'course platform', 'online class', 'student app', 'learning app', 'education technology', 'have you done edtech'],
      answer:
        '<p><strong>EdTech / e-learning</strong> — a shipped flagship domain: course and learning platforms.</p>' +
        '<ul>' +
        '<li><strong>Learner side</strong> — course catalogue, lesson player (video + notes + resources), progress tracking, quizzes and assignments, certificates, discussion.</li>' +
        '<li><strong>Instructor / admin side</strong> — course authoring, curriculum builder, cohort and batch management, grading, live-class scheduling.</li>' +
        '<li><strong>Around it</strong> — enrolment and payments, coupons, a reporting dashboard, and mobile-first lesson consumption for low-end devices and patchy networks.</li>' +
        '</ul>',
      chips: [
        { label: 'Education portal?', q: 'have you built an education portal' },
        { label: 'Job portal?', q: 'have you built a job portal' },
        { label: 'Which domains?', q: 'what domains have you worked in' }
      ]
    },
    {
      id: 'dom-job-portal',
      patterns: ['job portal', 'job board', 'recruitment platform', 'hiring platform', 'career site', 'job site', 'ats', 'applicant tracking', 'job listing', 'jobs website', 'have you built a job portal'],
      answer:
        '<p><strong>Job portal</strong> — yes, designed and built as a flagship product. It\'s really three products sharing a database:</p>' +
        '<ul>' +
        '<li><strong>Job seeker</strong> — profile &amp; résumé builder, smart search &amp; filters, one-click apply, saved jobs, application status, job alerts.</li>' +
        '<li><strong>Employer</strong> — company page, job posting with screening questions, candidate pipeline / ATS board, messaging, plan &amp; credit management.</li>' +
        '<li><strong>Admin</strong> — moderation, category &amp; taxonomy control, featured-listing management, analytics.</li>' +
        '</ul>' +
        '<p>The hard parts: matching relevance, a fast mobile apply flow, and keeping listing quality high.</p>',
      chips: [
        { label: 'Education portal?', q: 'have you built an education portal' },
        { label: 'EdTech work?', q: 'have you done edtech' },
        { label: 'HRMS work?', q: 'have you worked on HRMS' }
      ]
    },
    {
      id: 'dom-edu-portal',
      patterns: ['edu portal', 'education portal', 'school portal', 'college portal', 'university portal', 'student portal', 'campus management', 'school management system', 'sis', 'academic portal', 'result portal', 'admission portal', 'have you built an education portal'],
      answer:
        '<p><strong>Education / campus portal</strong> — yes. Distinct from EdTech: this is the <strong>institution\'s system of record</strong> for a school, college or university.</p>' +
        '<ul>' +
        '<li><strong>Admissions</strong> — application, document upload, merit lists, enrolment.</li>' +
        '<li><strong>Academics</strong> — class routine, attendance, assignments, exam scheduling, grade entry, results &amp; transcripts.</li>' +
        '<li><strong>Finance</strong> — fee structure, invoicing, online payment, dues tracking.</li>' +
        '<li><strong>Portals per role</strong> — a dense admin/registrar console, a teacher portal, and simple parent/student self-service for results, fees and notices.</li>' +
        '</ul>',
      chips: [
        { label: 'EdTech / e-learning?', q: 'have you done edtech' },
        { label: 'Job portal?', q: 'have you built a job portal' },
        { label: 'Enterprise UX', q: 'how do you design complex enterprise software' }
      ]
    },
    {
      id: 'enterprise-ux',
      patterns: ['complex enterprise software', 'complex software', 'enterprise ux', 'enterprise software', 'data dense', 'data-dense', 'admin panel', 'admin panels', 'admin dashboard', 'back office', 'back-office', 'internal tools', 'internal tool', 'b2b', 'erp crm', 'erp crm hrms', 'crm hrms'],
      answer:
        '<p>Designing <strong>dense, complex enterprise software</strong> is my sweet spot — ERP, CRM, HRMS, POS and monitoring tools like NMS and DCIM.</p>' +
        '<p>How I keep complexity usable:</p>' +
        '<ul>' +
        '<li><strong>Systemise everything</strong> — one component library, strict tokens, repeatable table &amp; form patterns</li>' +
        '<li><strong>Progressive disclosure</strong> — defaults up front, power in drawers and advanced views</li>' +
        '<li><strong>Role-aware UI</strong> — the screen adapts to permissions instead of greying half of it out</li>' +
        '<li><strong>Real data early</strong> — design with worst-case volumes, long strings and empty states, not lorem ipsum</li>' +
        '<li><strong>Keyboard &amp; bulk actions</strong> — people who live in this software all day need speed</li>' +
        '</ul>',
      chips: [
        { label: 'Design systems', q: 'tell me about design systems' },
        { label: 'Dashboards', q: 'do you design dashboards' },
        { label: 'Which domains?', q: 'what domains have you worked in' }
      ]
    },

    /* ---- UI/UX craft ---- */
    {
      id: 'accessibility',
      patterns: ['accessibility', 'a11y', 'wcag', 'accessible', 'screen reader', 'screen readers', 'contrast ratio', 'aria', 'keyboard navigation', 'inclusive design'],
      answer:
        '<p>Accessibility is built in, not bolted on. I work to <strong>WCAG 2.1 AA</strong>: semantic HTML, full <strong>keyboard operability</strong> with visible focus, correct <strong>ARIA</strong> only where needed, <strong>4.5:1</strong> text contrast, reduced-motion support, and real labels and error text on every form — tested with an actual screen reader.</p>' +
        '<p>For kiosks I also handle reachable touch height plus high-contrast and text-scaling modes.</p>',
      chips: [
        { label: 'Responsive design', q: 'do you do responsive design' },
        { label: 'Your approach', q: 'what is your approach' }
      ]
    },
    {
      id: 'responsive',
      patterns: ['responsive', 'responsive design', 'mobile first', 'mobile-first', 'breakpoints', 'adaptive', 'mobile web', 'cross device', 'cross-device', 'fluid layout'],
      answer:
        '<p>Yes — every build is <strong>responsive and usually mobile-first</strong>: fluid grids and type, sensible breakpoints, touch-friendly targets, and layouts that <em>reflow</em> rather than just shrink. I test on real devices, not only the browser resizer — I cleared a whole backlog of responsiveness issues at Streaming Plug.</p>',
      chips: [
        { label: 'Accessibility', q: 'do you do accessibility' },
        { label: 'Do you write code?', q: 'do you write code' }
      ]
    },
    {
      id: 'wireframing',
      patterns: ['wireframe', 'wireframes', 'wireframing', 'low fidelity', 'low-fidelity', 'lo fi', 'sketching', 'paper prototype', 'blueprint'],
      answer:
        '<p><strong>Wireframing</strong> is where I lock structure and flow before visuals — low-fidelity layouts, content priority and navigation, reviewed fast and cheap so we change the plan on paper, not in production. I\'ve built wireframes from business requirements at Future Track IT, Streaming Plug and ADN DigiNet.</p>',
      chips: [
        { label: 'Prototyping', q: 'do you build prototypes' },
        { label: 'Information architecture', q: 'do you do information architecture' }
      ]
    },
    {
      id: 'prototyping',
      patterns: ['prototype', 'prototypes', 'prototyping', 'interactive prototype', 'clickable prototype', 'high fidelity', 'high-fidelity', 'figma prototype', 'proof of concept'],
      answer:
        '<p>I build <strong>interactive prototypes</strong> in Figma — real flows, states and transitions — for stakeholder sign-off and for <strong>usability testing in Maze</strong> before a line of production code. When a concept needs to genuinely feel real, I prototype it in <strong>code</strong> instead.</p>',
      chips: [
        { label: 'Usability testing', q: 'how do you do ux research' },
        { label: 'Wireframing', q: 'tell me about wireframing' }
      ]
    },
    {
      id: 'interaction-design',
      patterns: ['interaction design', 'motion design', 'micro interaction', 'micro-interaction', 'microinteractions', 'animation', 'animations', 'transitions', 'ux motion', 'ixd'],
      answer:
        '<p><strong>Interaction &amp; motion design</strong> — I treat motion as feedback, not decoration: transitions that show where things came from, loading and skeleton states, meaningful micro-interactions, and easing that feels responsive. Because I build the front-end, that motion survives to production instead of dying in handoff — and it always respects reduced-motion preferences.</p>',
      chips: [
        { label: 'Do you write code?', q: 'do you write code' },
        { label: 'Design systems', q: 'tell me about design systems' }
      ]
    },
    {
      id: 'information-architecture',
      patterns: ['information architecture', 'ia', 'navigation design', 'site map', 'sitemap', 'card sorting', 'taxonomy', 'content structure', 'menu structure', 'findability'],
      answer:
        '<p><strong>Information architecture</strong> — structuring content and navigation so people find things without thinking: card sorting and tree testing, clear taxonomy and labels, sitemaps and user flows mapped in Miro, and navigation patterns that scale. Critical in ERP / CRM where there are hundreds of screens.</p>',
      chips: [
        { label: 'Wireframing', q: 'tell me about wireframing' },
        { label: 'Enterprise UX', q: 'how do you design complex enterprise software' }
      ]
    },
    {
      id: 'handoff',
      patterns: ['handoff', 'hand off', 'hand-off', 'developer handoff', 'design handoff', 'redlines', 'dev handoff', 'design to development', 'spec sheet'],
      answer:
        '<p><strong>Handoff</strong> is barely a step for me because I\'m on both sides of it. Figma files with proper components, variants, auto-layout and named tokens; documented states, spacing and behaviour; and since I write the front-end I can hand off to <em>myself</em> or pair closely with the dev team and review the build against the design.</p>',
      chips: [
        { label: 'Design systems', q: 'tell me about design systems' },
        { label: 'Do you write code?', q: 'do you write code' }
      ]
    },
    {
      id: 'usability-heuristics',
      patterns: ['heuristic', 'heuristics', 'heuristic evaluation', 'ux audit', 'ux review', 'nielsen', 'ux principles', 'design critique', 'usability review'],
      answer:
        '<p>I run <strong>heuristic evaluations and UX audits</strong> against known principles — visibility of system status, match to the real world, user control and undo, consistency, error prevention, recognition over recall, and clear help / error messaging. A fast way to catch the obvious problems before spending research budget on them.</p>',
      chips: [
        { label: 'UX research', q: 'how do you do ux research' },
        { label: 'Accessibility', q: 'do you do accessibility' }
      ]
    },
    {
      id: 'domains',
      patterns: ['domain', 'domains', 'industry', 'industries', 'sectors', 'sector', 'verticals', 'what fields', 'what industries', 'types of product', 'kinds of product', 'what products', 'ecommerce', 'e commerce', 'edtech', 'what have you worked on', 'what kind of software'],
      answer:
        '<p>Flagship products shipped across high-stakes domains:</p>' +
        '<ul>' +
        '<li><strong>Enterprise:</strong> ERP, CRM, HRMS</li>' +
        '<li><strong>Retail &amp; hospitality:</strong> POS, KDS (kitchen display), CDS (customer display), self-service Kiosk</li>' +
        '<li><strong>Marketing platforms:</strong> full SMS marketing solution, full email marketing solution</li>' +
        '<li><strong>Products:</strong> SaaS / B2B web apps, eCommerce, EdTech / e-learning, Job Portal, Education / campus portal, websites &amp; landing pages</li>' +
        '<li><strong>FinTech:</strong> digital banking &amp; branch-queue solutions (Prime Bank Digital Token)</li>' +
        '<li><strong>Infrastructure:</strong> network &amp; data-center monitoring (NMS, DCIM)</li>' +
        '</ul>' +
        '<p>Ask about any one — e.g. &ldquo;have you worked on POS?&rdquo;, &ldquo;what is a KDS?&rdquo; or &ldquo;have you built an SMS marketing platform?&rdquo;</p>',
      chips: [
        { label: 'POS / KDS / CDS', q: 'have you worked on POS' },
        { label: 'ERP / CRM / HRMS', q: 'have you worked on ERP' },
        { label: 'SMS / email marketing', q: 'have you built an sms marketing platform' },
        { label: 'EdTech / job / edu portal', q: 'have you done edtech' }
      ]
    },

    /* ---- Education ---- */
    {
      id: 'education',
      patterns: ['education', 'study', 'studied', 'degree', 'university', 'college', 'academic', 'qualification', 'bsc', 'cse', 'graduation', 'school', 'where did you study'],
      answer:
        '<p><strong>B.Sc. in Computer Science &amp; Engineering</strong> from the <strong>University of Development Alternative (UODA)</strong>, Dhaka, Bangladesh.</p>' +
        '<p>The CSE foundation is why design and code sit together so naturally for me. <a href="#education">Education section →</a></p>',
      chips: [
        { label: 'Your experience', q: 'tell me about your experience' },
        { label: 'Your skills', q: 'what are your skills' }
      ]
    },

    /* ---- Skills ---- */
    {
      id: 'skills',
      patterns: ['skills', 'skillset', 'expertise', 'good at', 'specialize', 'specialise', 'strength', 'strengths', 'what can you do', 'services', 'speciality', 'specialty', 'what are you good at'],
      answer:
        '<p>Core skills: <strong>UI design, UX research, information architecture, wireframing, prototyping, design systems, interaction &amp; motion design, usability testing and accessibility (WCAG AA)</strong> — plus <strong>front-end (HTML5, CSS3, Tailwind, React)</strong> and design-to-code handoff.</p>' +
        '<p>Applied across <strong>ERP, CRM, HRMS, POS, KDS, CDS, Kiosk, SMS &amp; email marketing platforms, EdTech, Job Portal, Edu portal, SaaS, FinTech, eCommerce and websites / landing pages</strong> — mostly dense, complex software.</p>',
      chips: [
        { label: 'Which domains?', q: 'what domains have you worked in' },
        { label: 'Design systems', q: 'tell me about design systems' },
        { label: 'UX research', q: 'how do you do ux research' }
      ]
    },
    {
      id: 'design-systems',
      patterns: ['design system', 'design systems', 'component library', 'tokens', 'design tokens', 'style guide', 'pattern library'],
      answer:
        '<p>Design systems are central to how I work — <em>&ldquo;design in systems, not screens.&rdquo;</em> Reusable components and clear tokens keep products consistent as they grow and make handoff to engineering painless. I\'ve built and owned shared systems at ADN DigiNet, Future Track IT and beyond.</p>',
      chips: [
        { label: 'Your approach', q: 'what is your approach' },
        { label: 'Figma', q: 'what do you use figma for' }
      ]
    },

    /* ---- Contact / hire ---- */
    {
      id: 'contact',
      patterns: ['contact', 'email', 'e mail', 'mail', 'reach you', 'reach out', 'get in touch', 'phone', 'number', 'call you', 'mobile', 'whatsapp', 'message you', 'how do i contact', 'your email', 'your number'],
      answer:
        '<p>Easiest ways to reach me:</p>' +
        '<ul>' +
        '<li><strong>Email:</strong> <a href="mailto:' + EMAIL + '">' + EMAIL + '</a></li>' +
        '<li><strong>Phone:</strong> <a href="tel:' + PHONE_RAW + '">' + PHONE_PRETTY + '</a></li>' +
        '</ul>' +
        '<p>Or open the <a href="#contact">Contact section</a> for Behance, LinkedIn and GitHub. I reply fast.</p>',
      chips: [
        { label: 'Are you available for hire?', q: 'are you available for hire' },
        { label: 'Get your resume', q: 'can I get your resume' },
        { label: 'Social links', q: 'where can I find you online' }
      ]
    },
    {
      id: 'hire',
      patterns: ['hire', 'available', 'availability', 'freelance', 'freelancer', 'open to work', 'looking for', 'full time', 'fulltime', 'contract', 'rate', 'rates', 'pricing', 'budget', 'cost', 'salary', 'compensation', 'pay expectation', 'expected salary', 'job offer', 'opportunity', 'collaborate', 'work together', 'work with you'],
      answer:
        '<p>Yes — currently <strong>open to collaborate</strong>. Available for <strong>full-time UI/UX roles</strong> and a couple of <strong>freelance slots</strong> this quarter.</p>' +
        '<p>Best next step: email me at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> or call <a href="tel:' + PHONE_RAW + '">' + PHONE_PRETTY + '</a> and tell me about the project.</p>',
      chips: [
        { label: 'Get your resume', q: 'can I get your resume' },
        { label: 'Show me your work', q: 'show me your work' },
        { label: 'Your experience', q: 'tell me about your experience' }
      ]
    },
    {
      id: 'resume',
      patterns: ['resume', 'cv', 'download resume', 'your cv', 'resume link', 'curriculum vitae'],
      answer:
        '<p>Here\'s the resume: <a href="' + RESUME + '" target="_blank" rel="noopener">open in Google Drive →</a></p>' +
        '<p>It\'s also linked from the <strong>Resume</strong> button at the top of the page.</p>',
      chips: [
        { label: 'Experience summary', q: 'tell me about your experience' },
        { label: 'Contact details', q: 'how do I contact you' }
      ]
    },
    {
      id: 'social',
      patterns: ['social', 'socials', 'behance', 'linkedin', 'github', 'dribbble', 'instagram', 'online', 'profile', 'profiles', 'find you', 'links', 'portfolio links'],
      answer:
        '<p>You can find me here:</p>' +
        '<ul>' +
        '<li><a href="https://www.behance.net/rejoanulferdoush" target="_blank" rel="noopener">Behance</a></li>' +
        '<li><a href="https://www.linkedin.com/in/rejoanulferdoush/" target="_blank" rel="noopener">LinkedIn</a></li>' +
        '<li><a href="https://github.com/rejoanulferdoush" target="_blank" rel="noopener">GitHub</a></li>' +
        '</ul>',
      chips: [
        { label: 'Contact details', q: 'how do I contact you' },
        { label: 'Show me your work', q: 'show me your work' }
      ]
    },
    {
      id: 'location',
      patterns: ['location', 'where are you', 'where are you based', 'based', 'city', 'country', 'dhaka', 'bangladesh', 'remote', 'work remote', 'work remotely', 'remote work', 'remotely', 'timezone', 'time zone', 'relocate', 'onsite', 'on site'],
      answer:
        '<p>Based in <strong>Dhaka, Bangladesh</strong>, and very comfortable working <strong>remote</strong> — I\'ve held roles with teams in Thailand and the USA, and shipped projects for <strong>international clients across Canada, Australia, the USA, the UAE, Pakistan, Nigeria and Rwanda</strong>. Cross–time-zone collaboration is normal for me.</p>',
      chips: [
        { label: 'Are you available for hire?', q: 'are you available for hire' },
        { label: 'International clients?', q: 'do you work with international companies' },
        { label: 'Your experience', q: 'tell me about your experience' }
      ]
    },
    {
      id: 'international',
      patterns: ['international', 'international company', 'international companies', 'international client', 'international clients', 'international project', 'international projects', 'global client', 'global clients', 'work internationally', 'working internationally', 'overseas', 'abroad', 'foreign client', 'foreign clients', 'foreign company', 'which countries', 'what countries', 'countries worked', 'countries have you worked', 'clients worldwide', 'worldwide', 'who are your clients', 'your clients', 'canada', 'canadian', 'australia', 'australian', 'nigeria', 'nigerian', 'rwanda', 'rwandan', 'pakistan', 'pakistani', 'uae', 'dubai', 'emirates', 'abu dhabi'],
      answer:
        '<p>Yes — a large part of my work is with <strong>international companies and clients</strong>. Working remotely from Dhaka, I\'ve designed and shipped products for teams and businesses across:</p>' +
        '<ul>' +
        '<li><strong>Canada</strong></li>' +
        '<li><strong>Australia</strong></li>' +
        '<li><strong>United States</strong></li>' +
        '<li><strong>United Arab Emirates</strong></li>' +
        '<li><strong>Pakistan</strong></li>' +
        '<li><strong>Nigeria</strong></li>' +
        '<li><strong>Rwanda</strong></li>' +
        '</ul>' +
        '<p>That\'s on top of full-time and part-time roles with companies in <strong>Bangladesh, Thailand and the USA</strong>. Discovery calls, async design reviews and design-to-code handoff across time zones are a normal part of how I work.</p>',
      chips: [
        { label: 'Your experience', q: 'tell me about your experience' },
        { label: 'Where are you based?', q: 'where are you based' },
        { label: 'Are you available for hire?', q: 'are you available for hire' }
      ]
    }
  ];

  /* ---------- Smalltalk (checked before the KB) -------------- */
  var SMALLTALK = [
    {
      /* Personal / off-topic questions — kept professional, steered back to work. */
      test: /\b(father|mother|dad|mom|mum|parents?|wife|husband|spouse|girlfriends?|boyfriends?|married|marriage|divorced?|dating|seeing someone|are you single|relationship status|your kids|have kids|children|kids|siblings?|your family|family name|religion|religious|caste|ethnicity|net worth|how old are you|your age|how much do you weigh|your weight|your height|date of birth|when were you born|birth ?place|hometown|home ?town|native place|your village|home address|where do you live|which area do you live|blood group|zodiac|horoscope|politics|political views?|nid number|passport number)\b/i,
      reply:
        '<p>I keep things to Rejoanul\'s professional side — his design and engineering work, experience, tools, and how to collaborate. That one\'s a bit personal, so I\'ll leave it. 🙂</p>' +
        '<p>For anything outside the portfolio, it\'s best to reach him directly at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.</p>',
      chips: defaultChips
    },
    {
      test: /\b(hi|hello|hey|yo|hiya|heya|hii+|helo|greetings|good morning|good evening|good afternoon)\b/i,
      reply: '<p>Hey! 👋 Ask me anything about Rejoanul — his work, experience, the tools he uses, or how to get in touch.</p>',
      chips: defaultChips
    },
    {
      test: /(how are you|how's it going|how is it going|what's up|whats up|sup|you good)\b/i,
      reply: '<p>Doing great, thanks for asking — ready to tell you anything about Rejoanul\'s work. What would you like to know?</p>',
      chips: defaultChips
    },
    {
      test: /\b(thanks|thank you|thank u|thx|ty|much appreciated|appreciate it|appreciated)\b/i,
      reply: '<p>Anytime! 🙌 Anything else you\'d like to know?</p>',
      chips: defaultChips
    },
    {
      test: /\b(bye|goodbye|see ya|see you later|catch you later|take care|good night)\b/i,
      reply: '<p>Take care! If you want to work together, email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> or check the <a href="#contact">Contact section</a>. 👋</p>',
      chips: null
    },
    {
      test: /(what can i ask|what should i ask|what do you know|what can you tell|show options|show menu|give me suggestions|list topics|help me)/i,
      reply: '<p>You can ask me about:</p><ul><li>His <strong>case studies</strong> — SAFE, Prime Bank Digital Token, NMS, DCIM — and the <strong>intro video</strong></li><li><strong>Domains</strong> — ERP, CRM, HRMS, POS, KDS, CDS, Kiosk, SMS &amp; email marketing solutions, EdTech, Job Portal, Edu portal, SaaS, eCommerce, websites &amp; landing pages</li><li><strong>Experience</strong>, what he did at each company, and the <strong>international clients</strong> he\'s worked with (Canada, Australia, USA, UAE, Pakistan, Nigeria, Rwanda)</li><li>His <strong>design approach</strong>, and UI/UX craft — accessibility, responsive, wireframing, prototyping, design systems, IA, motion</li><li>Any <strong>tool</strong> in his stack — e.g. &ldquo;what do you use Zapier / Maze / Jira / JMeter for?&rdquo;</li><li><strong>Education</strong>, <strong>skills</strong>, <strong>hiring</strong>, email, phone and social links</li></ul>',
      chips: defaultChips
    },
    {
      test: /(are you (a )?(bot|robot|ai|real|human)|is this a bot|are you rejoanul)/i,
      reply: '<p>I\'m a small assistant trained on Rejoanul\'s portfolio — think of me as his front desk. For the real conversation, email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.</p>',
      chips: defaultChips
    },
    {
      test: /(joke|fun fact|something fun|make me laugh)/i,
      reply: '<p>Fun fact: this whole site is hand-built — <em>no templates</em>. Even this chat window. That\'s the &ldquo;code is part of the design&rdquo; principle in action. 😄</p>',
      chips: defaultChips
    }
  ];

  function defaultChips() {
    return [
      { label: 'Show me your projects', q: 'show me your work' },
      { label: 'Domains & industries', q: 'what domains have you worked in' },
      { label: 'Your experience', q: 'tell me about your experience' },
      { label: 'Tools & tech', q: 'what tools do you use' },
      { label: 'Your design approach', q: 'what is your approach' },
      { label: 'Hire / contact', q: 'are you available for hire' }
    ];
  }

  /* ---------- Matcher --------------------------------------- */
  function normalize(str) {
    return ' ' + str.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  }

  function scoreTopic(topic, norm, tokens) {
    var score = 0;
    for (var i = 0; i < topic.patterns.length; i++) {
      var p = topic.patterns[i];
      if (p.indexOf(' ') !== -1) {
        if (norm.indexOf(' ' + p + ' ') !== -1) score += 4;
      } else {
        if (tokens.indexOf(p) !== -1) {
          score += 3;
        } else if (p.length >= 5) {
          for (var t = 0; t < tokens.length; t++) {
            if (tokens[t].length >= 5 && (tokens[t].indexOf(p) === 0 || p.indexOf(tokens[t]) === 0)) {
              score += 1.5;
              break;
            }
          }
        }
      }
    }
    return score;
  }

  function answerFor(text) {
    for (var s = 0; s < SMALLTALK.length; s++) {
      if (SMALLTALK[s].test.test(text)) {
        return { html: SMALLTALK[s].reply, chips: SMALLTALK[s].chips ? SMALLTALK[s].chips() : [] };
      }
    }

    var norm = normalize(text);
    var tokens = norm.trim().split(' ');
    var best = null, bestScore = 0;

    for (var i = 0; i < KB.length; i++) {
      var sc = scoreTopic(KB[i], norm, tokens);
      if (sc > bestScore) { bestScore = sc; best = KB[i]; }
    }

    if (best && bestScore >= 3) {
      return { html: best.answer, chips: best.chips || [] };
    }

    return {
      html:
        '<p>I don\'t have a specific answer for that yet. I can tell you about Rejoanul\'s <strong>case studies</strong> (SAFE, Prime Bank Token, NMS, DCIM), the <strong>intro video</strong>, his <strong>experience</strong>, the <strong>international clients</strong> he\'s worked with, his <strong>design approach</strong>, any <strong>tool</strong> in his stack, the <strong>domains</strong> he\'s shipped (ERP, CRM, HRMS, POS, KDS, CDS, Kiosk, SMS &amp; email marketing, EdTech, Job Portal, Edu portal, SaaS, eCommerce, websites), his <strong>education</strong> or <strong>how to hire him</strong>. Try one of these:</p>',
      chips: defaultChips()
    };
  }

  /* ---------- Hand-drawn icons (inline SVG, no icon font) ---- */
  var ICON = {
    close:
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="m6 6 12 12M18 6 6 18"/></svg>',
    closeLg:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">' +
      '<path d="m6 6 12 12M18 6 6 18"/></svg>',
    send:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M10.4 13.6 20.5 3.5"/><path d="M20.5 3.5 14.8 20a.6.6 0 0 1-1.1.05l-3.3-6.45-6.45-3.3a.6.6 0 0 1 .05-1.1Z"/></svg>'
  };

  /* ---------- UI ------------------------------------------- */
  function build() {
    var root = document.createElement('div');
    root.className = 'rf-chat';
    root.innerHTML = [
      '<div class="rf-chat__nudge" id="rfNudge" role="status">',
      '  <button class="rf-chat__nudge-close" id="rfNudgeClose" aria-label="Dismiss">&times;</button>',
      '  Hi, I’m <b>Rejoanul</b> — ask me anything about my work',
      '</div>',
      '<div class="rf-chat__panel" id="rfPanel" role="dialog" aria-label="Chat with Rejoanul" aria-modal="false">',
      '  <div class="rf-chat__header">',
      '    <span class="rf-chat__avatar"><img src="' + AVATAR + '" alt="Rejoanul Ferdoush"></span>',
      '    <span class="rf-chat__id">',
      '      <span class="rf-chat__name">Rejoanul Ferdoush</span>',
      '      <span class="rf-chat__status">UI/UX Engineer</span>',
      '    </span>',
      '    <span class="rf-chat__header-actions">',
      '      <button class="rf-chat__icon-btn" id="rfClose" title="Close" aria-label="Close chat">' + ICON.close + '</button>',
      '    </span>',
      '  </div>',
      '  <div class="rf-chat__log" id="rfLog" aria-live="polite" data-lenis-prevent></div>',
      '  <div class="rf-chat__suggests" id="rfSuggests"></div>',
      '  <form class="rf-chat__form" id="rfForm">',
      '    <textarea class="rf-chat__input" id="rfInput" rows="1" placeholder="Ask me anything…" autocomplete="off"></textarea>',
      '    <button type="submit" class="rf-chat__send" id="rfSend" aria-label="Send">' + ICON.send + '</button>',
      '  </form>',
      '  <p class="rf-chat__footnote">Trained on this portfolio · answers about Rejoanul only</p>',
      '</div>',
      '<button class="rf-chat__launcher" id="rfLauncher" aria-label="Open chat with Rejoanul" aria-expanded="false">',
      '  <img class="rf-chat__launcher-avatar" src="' + AVATAR + '" alt="">',
      '  <span class="rf-chat__launcher-close" aria-hidden="true">' + ICON.closeLg + '</span>',
      '  <span class="rf-chat__badge" aria-hidden="true"></span>',
      '</button>'
    ].join('');
    document.body.appendChild(root);
    return root;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var root = build();

    var launcher = root.querySelector('#rfLauncher');
    var panel = root.querySelector('#rfPanel');
    var closeBtn = root.querySelector('#rfClose');
    var log = root.querySelector('#rfLog');
    var suggests = root.querySelector('#rfSuggests');
    var form = root.querySelector('#rfForm');
    var input = root.querySelector('#rfInput');
    var nudge = root.querySelector('#rfNudge');
    var nudgeClose = root.querySelector('#rfNudgeClose');

    var started = false;
    var nudgeDismissed = false;

    function scrollLog() { log.scrollTop = log.scrollHeight; }

    function addMessage(html, who) {
      var wrap = document.createElement('div');
      wrap.className = 'rf-msg rf-msg--' + who;
      var bubble = document.createElement('div');
      bubble.className = 'rf-msg__bubble';
      if (who === 'user') bubble.textContent = html;
      else bubble.innerHTML = html;
      wrap.appendChild(bubble);
      log.appendChild(wrap);
      bubble.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function () {
          if (window.matchMedia('(max-width: 520px)').matches) setOpen(false);
        });
      });
      scrollLog();
      return wrap;
    }

    function showTyping() {
      var wrap = document.createElement('div');
      wrap.className = 'rf-msg rf-msg--bot rf-msg--typing';
      wrap.innerHTML = '<div class="rf-msg__bubble"><span></span><span></span><span></span></div>';
      log.appendChild(wrap);
      scrollLog();
      return wrap;
    }

    function renderChips(chips) {
      suggests.innerHTML = '';
      if (!chips || !chips.length) return;
      chips.forEach(function (c, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'rf-chip';
        b.textContent = c.label;
        b.style.animationDelay = (i * 40) + 'ms';
        b.addEventListener('click', function () { send(c.q, c.label); });
        suggests.appendChild(b);
      });
    }

    function botRespond(text) {
      var res = answerFor(text);
      var typing = showTyping();
      var delay = reduceMotion ? 200 : Math.min(1500, 550 + text.length * 12);
      window.setTimeout(function () {
        typing.remove();
        addMessage(res.html, 'bot');
        renderChips(res.chips);
      }, delay);
    }

    function send(query, displayText) {
      addMessage(displayText || query, 'user');
      suggests.innerHTML = '';
      botRespond(query);
    }

    function greet() {
      if (started) return;
      started = true;
      addMessage(
        '<p>Hi, I’m <strong>Rejoanul Ferdoush</strong>, UI/UX Engineer. Ask me anything about my case studies, experience, the tools I use, the domains I’ve shipped, or how to reach me.</p>' +
        '<p>Here are a few things you can ask:</p>',
        'bot'
      );
      renderChips(defaultChips());
    }

    var isPhone = function () { return window.matchMedia('(max-width: 520px)').matches; };

    function setOpen(open) {
      root.classList.toggle('is-open', open);
      launcher.setAttribute('aria-expanded', String(open));
      // Lock the page behind the full-screen sheet on phones
      document.documentElement.classList.toggle('rf-chat-lock', open && isPhone());
      if (open) {
        dismissNudge();
        greet();
        window.setTimeout(function () {
          if (!isPhone()) input.focus();
        }, 350);
      }
    }
    function toggle() { setOpen(!root.classList.contains('is-open')); }

    launcher.addEventListener('click', toggle);
    closeBtn.addEventListener('click', function () { setOpen(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('is-open')) setOpen(false);
    });

    function autoGrow() {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 96) + 'px';
    }
    input.addEventListener('input', autoGrow);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = input.value.trim();
      if (!val) return;
      input.value = '';
      autoGrow();
      send(val);
    });

    function dismissNudge() { nudge.classList.remove('is-visible'); }
    function killNudge() {
      nudgeDismissed = true;
      dismissNudge();
      try { sessionStorage.setItem('rfNudgeDismissed', '1'); } catch (err) {}
    }
    nudgeClose.addEventListener('click', function (e) {
      e.stopPropagation();
      killNudge();
    });
    nudge.addEventListener('click', function () { setOpen(true); });

    try { nudgeDismissed = sessionStorage.getItem('rfNudgeDismissed') === '1'; } catch (err) {}

    window.setTimeout(function () {
      if (!nudgeDismissed && !root.classList.contains('is-open')) {
        nudge.classList.add('is-visible');
        window.setTimeout(function () {
          if (!root.classList.contains('is-open')) dismissNudge();
        }, 9000);
      }
    }, 3200);
  });
})();
