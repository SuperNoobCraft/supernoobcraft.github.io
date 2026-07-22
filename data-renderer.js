/* Lightweight portfolio data and renderer for CV, projects and games pages */
(function () {
    const portfolioData = {
        cv: {
            featured: ['hku-toolkit', 'midnight-gambit', 'victoria-prison'],
            work: ['his-intern', 'atl']
        },
        work: [
            {
                id: 'his-intern',
                title: 'HKU Visioneers (Human-System Interaction Simulation Lab)',
                role: 'Game Development Intern',
                time: 'Jun–Aug 2026',
                context: 'Department of Data and Systems Engineering, HKU',
                description: [
                    'Develop interactive XR experiences and game demos using Unity, including the design and development of [Siege Command Simulator](item:siege-command-simulator), a strategy game for a CAVE environment.',
                    'Support laboratory operations through facility supervision, technical troubleshooting, and user assistance for XR facilities and equipment.', 
                    'Assist with workshops, demonstrations, and outreach activities, including Knowledge Exchange programmes for SEN students and laboratory showcase events.'
                ],
                link: 'https://visioneers.hku.hk/',
                thumbnail: 'images/visioneers.png',
                tags: ['unity', 'vr', 'xr', 'game-design', 'game-development']
            },
            {
                id: 'atl',
                title: 'Arts Tech Lab',
                role: 'Software Engineer Intern',
                time: 'Jan–May 2026',
                context: 'Faculty of Arts, HKU',
                description: [
                    'Designed and deployed a QR-based inventory management system and provided technical support for XR facilities.',
                    'Developing an AI-powered lab assistant agent using n8n and MongoDB to automate responses to student inquiries and equipment requests.',
                    'Improved the [House of Serenos](item:house-of-serenos) VR demo for public exhibition, fixing interaction issues, and providing on-site support.'
                ],
                link: 'https://www.atlab.hku.hk/',
                thumbnail: 'images/atl-thumb.png',
                tags: ['n8n', 'mongodb', 'unity', 'vr', 'technical-support']
            }
        ],
        projects: [
            {
                id: 'hku-toolkit',
                title: 'HKU Course Project Documentation Tool',
                role: 'Creator',
                time: 'Mar–Apr 2026',
                context: 'HKU · BSIM3021',
                description: [
                    'Conceived, designed, and developed a browser-based web tool that helps HKU students document, organize, and reuse course projects.',
                    'Supports ZIP and [PDF exports](CourseProjects.pdf) suitable for applications, submissions, and personal archiving.',
                    'Designed with accessible navigation, local data ownership, and minimal workflow friction for real academic use.'
                ],
                link: 'https://supernoobcraft.github.io/hku-toolkit',
                thumbnail: 'images/cpdk-thumb.png',
                tags: ['html', 'css', 'javascript', 'accessibility', 'pdf', 'zip']
            },
            {
                id: 'game-tech-timeline',
                title: 'Game-Tech Timeline',
                role: 'Designer & Developer',
                time: 'Mar–Apr 2025',
                context: 'HKU · HUDT2100',
                description: [
                    'Created a website that showcases a brief timeline of the evolution of video games alongside the improvements of modern computing and graphics technology.',
                    'Focused on learning the methods and presenting the development of Digital Humanities ideas in a concise web format.',
                    'Successfully learned to create and deploy a website as the final deliverable.'
                ],
                link: 'https://hoganjimhudt2100.neocities.org/',
                thumbnail: 'images/gt-thumb.png',
                tags: ['html', 'css', 'javascript', 'digital-humanities', 'timeline']
            },
            {
                id: 'noobsmp',
                title: 'NoobSMP',
                role: 'Founder & Server Administrator',
                time: '2020–Current',
                context: 'Personal Project',
                description: [
                    'Host and maintain a private Minecraft SMP server since 2020 across 5+ seasons, handling networking and long-term uptime management.',
                    'Manage community infrastructure including Discord server administration and website map integration.',
                    'Produced a Season 4 recap montage, handling full video editing and narrative framing for the community.'
                ],
                link: 'https://youtu.be/nP5n-KmLmbE?si=n53-kVkrfEBRXwpK',
                thumbnail: 'images/noobsmp-thumb.png',
                tags: ['networking', 'administration', 'discord', 'video-editing']
            },
            {
                id: 'victoria-prison',
                title: 'Behind Bars: Victoria Prison',
                role: 'Programmer',
                time: 'Feb–May 2025',
                context: 'HKU · HUDT2205',
                description: [
                    'Recreated Tai Kwun’s B Hall in Unreal Engine for digital humanities teaching.',
                    'Worked with Twinmotion and SketchUp assets to produce an immersive environment.'
                ],
                link: 'https://www.youtube.com/watch?v=spF1-0IPyLM',
                thumbnail: 'images/vr-thumb.png',
                tags: ['unreal-engine', 'twinmotion', 'sketchup', 'digital-humanities']
            },
            {
                id: 'house-of-serenos',
                title: 'House of Serenos',
                role: 'Programmer',
                time: 'Feb-Mar 2026',
                context: 'HKU · [Arts Tech Lab Internship](item:atl)',
                relatedWork: 'atl',
                description: [
                    'Improved the VR demo for public exhibition, fixing interaction issues, and providing on-site support.',
                    'Implemented a new teleportation system and improved the user interface for better accessibility.'
                ],
                link: 'https://www.atlab.hku.hk/house-of-sereno/',
                thumbnail: 'images/serenos-thumb.png',
                tags: ['unity', 'c#', 'vr', 'technical-support']
            }
        ],
        games: [
            {
                id: 'midnight-gambit',
                title: 'Midnight Gambit',
                role: 'Lead Game Designer, Programmer',
                time: 'Jan 2026',
                context: 'Global Game Jam HK 2026 (Team of 8)',
                description: [
                    'Designed the complete gameplay loop of a strategy-versus game blending chess mechanics, hidden identity, and resource management.',
                    'Designed and balanced a complete unit roster of 6 types with distinct mechanics and costs.',
                    'Implemented the Main Menu, Tutorial, and Audio systems in Unity.'
                ],
                link: 'https://globalgamejam.org/games/2026/not-chess-9',
                thumbnail: 'images/mask-thumb.png',
                tags: ['unity', 'c#', 'game-design', 'strategy']
            },
            {
                id: 'nyxia',
                title: 'Nyxia',
                role: 'Lead Programmer, Game Mechanics Designer',
                time: 'Mar 2025–Current',
                context: 'HKU ATL GameMakers Group (HAGG)',
                description: [
                    'Design and implement core gameplay systems for a metroidvania project.',
                    'Collaborate with designers and artists to iterate quickly on mechanics and balancing.'
                ],
                link: 'https://www.atlab.hku.hk/lab-use-and-policies/atl-student-cohort-group/gamemakers-group/',
                thumbnail: 'images/nyxia-thumb.png',
                tags: ['c#', 'unity', 'metroidvania', 'game-development']
            },
            {
                id: 'warlike-mech',
                title: 'Warlike Mech',
                role: 'Project Manager, Lead Game Designer',
                time: 'Aug–Dec 2022',
                context: 'Pui Ching Middle School · JFK scheme',
                description: [
                    'Developed a 2D action-platformer in a small team, responsible for project management, map design, and mechanics design.',
                    'Delivered a playable demo on itch.io to showcase gameplay and narrative.'
                ],
                link: 'https://grain-studios.itch.io/warlike-mech',
                thumbnail: 'images/vvm-thumb.png',
                tags: ['gamemaker', 'game-design', 'project-management']
            },
            {
                id: 'wordle-clone',
                title: 'Wordle Clone',
                role: 'Programmer',
                time: 'Sep–Nov 2025',
                context: 'HKU · COMP2113',
                description: [
                    'Built a Wordle-inspired clone with multiple modes and a leaderboard.',
                    'Implemented game logic and persistence in C++.'
                ],
                link: 'https://www.youtube.com/watch?v=g0ANt6j9q2A',
                thumbnail: 'images/wordle-thumb.png',
                tags: ['c++', 'game-design', 'puzzle']
            },
            {
                id: 'happy-derby',
                title: 'Happy Derby',
                role: 'Game Designer, Programmer',
                time: 'Feb–May 2026',
                context: 'HKU · COMP3329',
                description: [
                    'Created a multiplayer racing game with unique mechanics and a vibrant art style.',
                    'Implemented core gameplay systems and spectators betting function through Google Forms integration.'
                ],
                link: 'https://canva.link/encs707ori7swqq',
                thumbnail: 'images/derby-thumb.png',
                tags: ['unity', 'c#', 'game-design', 'party']
            },
            {
                id: 'pinball-foddian',
                title: 'Pinball Foddian (Work-in-Progress, click here to play demo)',
                role: 'Solo Developer',
                time: 'Mar 2026–Current',
                context: 'Solo Project',
                description: [
                    'Designed and developed a platformer game centered around a single-button control scheme, where players navigate levels by manipulating a bouncing ball.',
                    'Incorporated Foddian game mechanics to intentionally frustrate the player and create a unique challenge.',
                    'Playable demo available by clicking the link above.'
                ],
                link: 'games/pinball-foddian/index.html',
                thumbnail: 'images/pinball-thumb.png',
                tags: ['unity', 'c#', 'game-design', 'platformer']
            },
            {
                id: 'siege-command-simulator',
                title: 'Siege Command Simulator (CAVE)',
                role: 'Creator',
                time: 'Jul 2026',
                context: 'HKU · [Visioneers Internship](item:his-intern)',
                relatedWork: 'his-intern',
                description: [
                    'Developed a strategy game prototype for a CAVE environment, where players command units in a siege scenario.',
                    'Implemented AI for enemy units, physical-dodging mechanics in CAVE, and cross-CAVE multiplayer.'
                ],
                link: '',
                thumbnail: 'images/siege-thumb.png',
                tags: ['unity', 'c#', 'game-design', 'xr', 'cave']
            }
        ]
    };

    const cv = portfolioData.cv;
    const workItems = portfolioData.work;
    const projects = portfolioData.projects;
    const games = portfolioData.games;

    const map = {};
    const pageById = {};
    (workItems || []).forEach(p => {
        map[p.id] = p;
        pageById[p.id] = 'index.html';
    });
    (projects || []).forEach(p => {
        map[p.id] = p;
        pageById[p.id] = 'projects.html';
    });
    (games || []).forEach(g => {
        map[g.id] = g;
        pageById[g.id] = 'games.html';
    });

    const HIGHLIGHT_MS = 1400;

    function pageForId(id) {
        return pageById[id] || 'index.html';
    }

    function hrefForItem(id) {
        return pageForId(id) + '#' + encodeURIComponent(id);
    }

    function resolveHref(href) {
        const raw = String(href || '').trim();
        if (raw.indexOf('item:') === 0) {
            return hrefForItem(raw.slice(5));
        }
        return raw;
    }

    function appendDescriptionWithLinks(parent, text) {
        const source = String(text || '');
        const linkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
        let cursor = 0;
        let match;

        while ((match = linkPattern.exec(source)) !== null) {
            if (match.index > cursor) {
                parent.appendChild(document.createTextNode(source.slice(cursor, match.index)));
            }

            const linkLabel = match[1];
            const resolvedHref = resolveHref(match[2]);
            const anchor = document.createElement('a');
            anchor.href = resolvedHref;
            anchor.textContent = linkLabel;

            if (match[2].indexOf('item:') === 0 || resolvedHref.charAt(0) === '#') {
                anchor.className = 'portfolio-crosslink';
            } else {
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
            }

            parent.appendChild(anchor);
            cursor = match.index + match[0].length;
        }

        if (cursor < source.length) {
            parent.appendChild(document.createTextNode(source.slice(cursor)));
        }
    }

    function appendMetaLine(parent, timeText, contextText) {
        const meta = document.createElement('p');
        meta.className = 'project-meta';

        if (timeText) {
            meta.appendChild(document.createTextNode(timeText));
        }
        if (timeText && contextText) {
            meta.appendChild(document.createTextNode(' · '));
        }
        if (contextText) {
            appendDescriptionWithLinks(meta, contextText);
        }

        if (meta.childNodes.length) {
            parent.appendChild(meta);
        }
        return meta;
    }

    function highlightItem(el) {
        if (!el) return;
        el.classList.remove('portfolio-flash');
        // Force reflow so re-triggering the animation works
        void el.offsetWidth;
        el.classList.add('portfolio-flash');
        window.setTimeout(() => el.classList.remove('portfolio-flash'), HIGHLIGHT_MS);
    }

    function focusHashTarget(options) {
        const opts = options || {};
        const rawHash = (window.location.hash || '').replace(/^#/, '');
        if (!rawHash) return false;

        const id = decodeURIComponent(rawHash);
        const el = document.getElementById(id);
        if (!el) return false;

        const headerOffset = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--header-offset'),
            10
        ) || 92;
        const top = el.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
        window.scrollTo({ top: Math.max(0, top), behavior: opts.instant ? 'auto' : 'smooth' });
        highlightItem(el);
        return true;
    }

    function renderProject(item) {
        const el = document.createElement('div');
        el.className = 'project';
        if (item.id) el.id = item.id;

        const img = document.createElement('img');
        img.className = 'project-thumb';
        img.src = item.thumbnail || 'images/icon.ico';
        img.alt = item.title || '';

        const content = document.createElement('div');

        const title = document.createElement('div');
        title.className = 'project-title';
        const a = document.createElement('a');
        a.href = item.link || '#';
        if (item.link) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        }
        a.textContent = item.title + (item.role ? ' – ' + item.role : '');
        title.appendChild(a);

        appendMetaLine(content, item.time, item.context);

        const ul = document.createElement('ul');
        if (Array.isArray(item.description)) {
            item.description.forEach(d => {
                const li = document.createElement('li');
                appendDescriptionWithLinks(li, d);
                ul.appendChild(li);
            });
        } else if (item.description) {
            const li = document.createElement('li');
            appendDescriptionWithLinks(li, item.description);
            ul.appendChild(li);
        }

        const tech = document.createElement('p');
        tech.className = 'project-tech';
        tech.textContent = (item.tags || []).join(' · ');

        content.insertBefore(title, content.firstChild);
        if (ul.children.length) content.appendChild(ul);
        content.appendChild(tech);

        el.appendChild(img);
        el.appendChild(content);
        return el;
    }

    function renderWorkExperience(item) {
        const el = document.createElement('div');
        el.className = 'project';
        if (item.id) el.id = item.id;

        const img = document.createElement('img');
        img.className = 'project-thumb';
        img.src = item.thumbnail || 'images/icon.ico';
        img.alt = item.title || '';

        const content = document.createElement('div');

        const title = document.createElement('div');
        title.className = 'project-title';
        const a = document.createElement('a');
        a.href = item.link || '#';
        if (item.link) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        }
        a.textContent = item.role || item.title || '';
        title.appendChild(a);

        const company = document.createElement('p');
        company.className = 'project-meta';
        company.textContent = item.title || '';

        content.appendChild(title);
        content.appendChild(company);
        appendMetaLine(content, item.time, item.context);

        const ul = document.createElement('ul');
        if (Array.isArray(item.description)) {
            item.description.forEach(d => {
                const li = document.createElement('li');
                appendDescriptionWithLinks(li, d);
                ul.appendChild(li);
            });
        } else if (item.description) {
            const li = document.createElement('li');
            appendDescriptionWithLinks(li, item.description);
            ul.appendChild(li);
        }

        const tech = document.createElement('p');
        tech.className = 'project-tech';
        tech.textContent = (item.tags || []).join(' · ');

        if (ul.children.length) content.appendChild(ul);
        if (tech.textContent) content.appendChild(tech);

        el.appendChild(img);
        el.appendChild(content);
        return el;
    }

    function parseFirstDateValue(timeText) {
        if (!timeText || typeof timeText !== 'string') {
            return Number.POSITIVE_INFINITY;
        }

        const normalized = timeText.replace(/\s+/g, ' ').trim();
        const yearMatch = normalized.match(/(19|20)\d{2}/);
        const monthMap = {
            jan: 1,
            feb: 2,
            mar: 3,
            apr: 4,
            may: 5,
            jun: 6,
            jul: 7,
            aug: 8,
            sep: 9,
            sept: 9,
            oct: 10,
            nov: 11,
            dec: 12
        };

        const monthMatch = normalized.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/i);
        const monthValue = monthMatch ? monthMap[monthMatch[1].toLowerCase()] : 1;
        const yearValue = yearMatch ? Number(yearMatch[0]) : Number.POSITIVE_INFINITY;

        if (!Number.isFinite(yearValue)) {
            return Number.POSITIVE_INFINITY;
        }

        return (yearValue * 100) + monthValue;
    }

    function compareProjects(a, b, sortValue) {
        if (sortValue === 'name-asc') {
            return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
        }

        const dateDelta = parseFirstDateValue(a.time) - parseFirstDateValue(b.time);
        const direction = sortValue === 'time-desc' ? -1 : 1;

        if (dateDelta !== 0) {
            return dateDelta * direction;
        }

        return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
    }

    // Render work experience
    const workList = document.getElementById('work-list');
    if (workList) {
        workList.innerHTML = '';
        (cv && cv.work ? cv.work : []).forEach(id => {
            const item = map[id];
            if (item) workList.appendChild(renderWorkExperience(item));
        });
    }

    // Render featured projects (limit to 6)
    const featured = document.getElementById('featured-projects');
    if (featured) {
        featured.innerHTML = '';
        (cv && cv.featured ? cv.featured.slice(0, 6) : []).forEach(id => {
            const item = map[id];
            if (item) featured.appendChild(renderProject(item));
        });
    }

    function createListWithSearch(items, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        const controls = document.createElement('div');
        controls.className = 'portfolio-controls';

        const sortWrap = document.createElement('label');
        sortWrap.className = 'portfolio-sort-controls';
        sortWrap.textContent = 'Sort by';

        const sort = document.createElement('select');
        sort.className = 'portfolio-sort';
        sort.innerHTML = [
            '<option value="time-asc">Time (oldest first)</option>',
            '<option value="time-desc">Time (newest first)</option>',
            '<option value="name-asc">Name (A-Z)</option>'
        ].join('');
        sort.value = 'time-asc';
        sortWrap.appendChild(sort);

        const searchWrap = document.createElement('div');
        searchWrap.className = 'portfolio-search-controls';
        const search = document.createElement('input');
        search.type = 'search';
        search.placeholder = 'Filter by keyword or tag';
        search.className = 'portfolio-search';
        searchWrap.appendChild(search);

        controls.appendChild(sortWrap);
        controls.appendChild(searchWrap);
        container.appendChild(controls);

        const listWrap = document.createElement('div');
        container.appendChild(listWrap);

        let isFirstRender = true;

        function update(options) {
            const opts = options || {};
            const hashId = decodeURIComponent((window.location.hash || '').replace(/^#/, ''));
            if (opts.focusHash && hashId && items.some(it => it.id === hashId) && search.value) {
                search.value = '';
            }

            const q = (search.value || '').trim().toLowerCase();
            const sortValue = sort.value;
            listWrap.innerHTML = '';
            const filtered = items.filter(it => {
                if (!q) return true;
                const hay = (it.title + ' ' + (it.role || '') + ' ' + (it.tags || []).join(' ') + ' ' + (Array.isArray(it.description) ? it.description.join(' ') : it.description || '')).toLowerCase();
                return hay.indexOf(q) !== -1;
            }).slice().sort((a, b) => compareProjects(a, b, sortValue));
            filtered.forEach(it => listWrap.appendChild(renderProject(it)));

            if (opts.focusHash || isFirstRender) {
                isFirstRender = false;
                window.requestAnimationFrame(() => focusHashTarget({ instant: false }));
            }
        }

        search.addEventListener('input', () => update());
        sort.addEventListener('change', () => update());
        window.addEventListener('hashchange', () => update({ focusHash: true }));
        update({ focusHash: true });
    }

    // Full pages
    if (document.getElementById('projects-list')) {
        createListWithSearch(projects || [], 'projects-list');
    }
    if (document.getElementById('games-list')) {
        createListWithSearch(games || [], 'games-list');
    }

    // CV page — focus after render (list pages handle this in createListWithSearch)
    if (!document.getElementById('projects-list') && !document.getElementById('games-list')) {
        window.requestAnimationFrame(() => focusHashTarget({ instant: false }));
        window.addEventListener('hashchange', () => focusHashTarget({ instant: false }));
    }

})();
