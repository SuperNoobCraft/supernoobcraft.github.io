/* Lightweight portfolio data and renderer for CV, projects and games pages */
(function () {
    const portfolioData = {
        cv: {
            featured: ['hku-toolkit', 'midnight-gambit', 'victoria-prison'],
            work: ['xrc-intern', 'atl']
        },
        work: [
            {
                id: 'xrc-intern',
                title: 'Human-System Interaction Simulation Lab',
                role: 'XR Content Development/Game Development Intern',
                time: 'Jun–Aug 2026',
                context: 'Department of Data and Systems Engineering, HKU',
                description: [
                    'Develop and optimize immersive XR content and interactive experiences using cutting-edge tools and technologies.',
                    'Contribute to game development workflows, including design, prototyping, and implementation of interactive elements.',
                    'Document processes and findings to support project scalability and knowledge sharing.'
                ],
                link: 'https://www.dase.hku.hk/facilities/human-system-interaction-and-simulation-laboratory-his',
                thumbnail: 'images/xrc-thumb.png',
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
                    'Improved the "House of Serenos" VR demo for public exhibition, fixing interaction issues, and providing on-site support.'
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
                    'Built a browser-based web tool to help HKU students document, organize, preview, and reuse course projects in a consistent structure.',
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
                role: 'Creator',
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
                    'Host and maintain a private Minecraft SMP server across 5+ seasons, handling networking and long-term uptime management.',
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
                context: 'HKU',
                description: [
                    'Recreated Tai Kwun’s B Hall in Unreal Engine for digital humanities teaching.',
                    'Worked with Twinmotion and SketchUp assets to produce an immersive environment.'
                ],
                link: 'https://www.youtube.com/watch?v=spF1-0IPyLM',
                thumbnail: 'images/vr-thumb.png',
                tags: ['unreal-engine', 'twinmotion', 'sketchup', 'digital-humanities']
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
                title: 'Pinball Foddian (Work-in-Progress)',
                role: 'Creator',
                time: 'Mar 2026–Current',
                context: 'Solo Project',
                description: [
                    'Creating a platformer game with only 1 button input, where the player must navigate through levels by controlling a bouncing ball.',
                    'Incorporated Foddian game mechanics to intentionally frustrate the player and create a unique challenge.'
                ],
                link: 'games/pinball-foddian/index.html',
                thumbnail: 'images/pinball-thumb.png',
                tags: ['unity', 'c#', 'game-design', 'platformer']
            }
        ]
    };

    const cv = portfolioData.cv;
    const workItems = portfolioData.work;
    const projects = portfolioData.projects;
    const games = portfolioData.games;

    const map = {};
    (workItems || []).forEach(p => (map[p.id] = p));
    (projects || []).forEach(p => (map[p.id] = p));
    (games || []).forEach(g => (map[g.id] = g));

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
            const linkHref = match[2];
            const anchor = document.createElement('a');
            anchor.href = linkHref;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.textContent = linkLabel;
            parent.appendChild(anchor);

            cursor = match.index + match[0].length;
        }

        if (cursor < source.length) {
            parent.appendChild(document.createTextNode(source.slice(cursor)));
        }
    }

    function renderProject(item) {
        const el = document.createElement('div');
        el.className = 'project';

        const img = document.createElement('img');
        img.className = 'project-thumb';
        img.src = item.thumbnail || 'images/icon.ico';
        img.alt = item.title || '';

        const content = document.createElement('div');

        const title = document.createElement('div');
        title.className = 'project-title';
        const a = document.createElement('a');
        a.href = item.link || '#';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = item.title + (item.role ? ' – ' + item.role : '');
        title.appendChild(a);

        const meta = document.createElement('p');
        meta.className = 'project-meta';
        meta.textContent = (item.time ? item.time + ' · ' : '') + (item.context || '');

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

        content.appendChild(title);
        content.appendChild(meta);
        if (ul.children.length) content.appendChild(ul);
        content.appendChild(tech);

        el.appendChild(img);
        el.appendChild(content);
        return el;
    }

    function renderWorkExperience(item) {
        const el = document.createElement('div');
        el.className = 'project';

        const img = document.createElement('img');
        img.className = 'project-thumb';
        img.src = item.thumbnail || 'images/icon.ico';
        img.alt = item.title || '';

        const content = document.createElement('div');

        const title = document.createElement('div');
        title.className = 'project-title';
        const a = document.createElement('a');
        a.href = item.link || '#';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = item.role || item.title || '';
        title.appendChild(a);

        const company = document.createElement('p');
        company.className = 'project-meta';
        company.textContent = item.title || '';

        const meta = document.createElement('p');
        meta.className = 'project-meta';
        meta.textContent = [item.time, item.context].filter(Boolean).join(' · ');

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

        content.appendChild(title);
        content.appendChild(company);
        if (meta.textContent) content.appendChild(meta);
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

        function update() {
            const q = (search.value || '').trim().toLowerCase();
            const sortValue = sort.value;
            listWrap.innerHTML = '';
            const filtered = items.filter(it => {
                if (!q) return true;
                const hay = (it.title + ' ' + (it.role || '') + ' ' + (it.tags || []).join(' ') + ' ' + (Array.isArray(it.description) ? it.description.join(' ') : it.description || '')).toLowerCase();
                return hay.indexOf(q) !== -1;
            }).slice().sort((a, b) => compareProjects(a, b, sortValue));
            filtered.forEach(it => listWrap.appendChild(renderProject(it)));
        }

        search.addEventListener('input', update);
        sort.addEventListener('change', update);
        update();
    }

    // Full pages
    if (document.getElementById('projects-list')) {
        createListWithSearch(projects || [], 'projects-list');
    }
    if (document.getElementById('games-list')) {
        createListWithSearch(games || [], 'games-list');
    }

})();
