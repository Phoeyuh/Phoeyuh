const fs = require('fs');

async function updateStats() {
  const username = 'Phoeyuh'; 
  const token = process.env.GH_TOKEN; 

  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    const userData = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    const reposData = await reposRes.json();
    
    let totalStars = 0;
    let totalForks = 0;
    
    reposData.forEach(repo => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
    });

    const escapeXml = (unsafe) => {
      return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const generateSVG = (themeName, colors) => {
      const createRow = (key, value) => {
        const dotsLen = 65 - key.length - String(value).length - 2;
        return `<tspan class="key">${escapeXml(key)}</tspan><tspan class="cc"> ${'.'.repeat(Math.max(0, dotsLen))} </tspan><tspan class="val">${escapeXml(value)}</tspan>`;
      };

      const createDoubleRow = (k1, v1, k2, v2) => {
        const c1Dots = 29 - k1.length - String(v1).length - 2;
        const part1 = `<tspan class="key">${escapeXml(k1)}</tspan><tspan class="cc"> ${'.'.repeat(Math.max(0, c1Dots))} </tspan><tspan class="val">${escapeXml(v1)}</tspan>`;
        
        const c2Dots = 33 - k2.length - String(v2).length - 2;
        const part2 = `<tspan class="key">${escapeXml(k2)}</tspan><tspan class="cc"> ${'.'.repeat(Math.max(0, c2Dots))} </tspan><tspan class="val">${escapeXml(v2)}</tspan>`;
        
        return `${part1}<tspan class="cc"> | </tspan>${part2}`;
      };

      const rightColumn = [
        `<tspan fill="${colors.main}">Phoeyuh </tspan><tspan class="cc">${'-'.repeat(57)}</tspan>`,
        createRow('. OS:', 'Windows 10'),
        createRow('. Host:', 'Lenovo LOQ 15IRX10'),
        createRow('. Role:', 'Computer Engineering Student'),
        createRow('. IDE:', 'VS Code'),
        `<tspan class="cc">.</tspan>`,
        createRow('. Languages.Programming:', 'Java, Python, JavaScript, C++'),
        createRow('. Languages.Computer:', 'HTML, CSS, JSON'),
        createRow('. Languages.Real:', 'Italian, English'),
        `<tspan class="cc">.</tspan>`,
        createRow('. Hobbies.Software:', 'Web Dev (Cloudflare, Firebase), Local AI'),
        createRow('. Hobbies.Hardware:', 'Robotics, AI-Integrated Devices'),
        `<tspan class="cc">.</tspan>`,
        `<tspan fill="${colors.main}">- Contact </tspan><tspan class="cc">${'-'.repeat(55)}</tspan>`,
        createRow('. Email:', 'phoeyuhhh@gmail.com'),
        createRow('. GitHub:', 'Phoeyuh'),
        `<tspan class="cc">.</tspan>`,
        `<tspan fill="${colors.main}">- GitHub Stats </tspan><tspan class="cc">${'-'.repeat(50)}</tspan>`,
        createDoubleRow('. Repos:', userData.public_repos, 'Stars:', totalStars),
        createDoubleRow('. Followers:', userData.followers, 'Following:', userData.following),
        createDoubleRow('. Forks:', totalForks, 'Gists:', userData.public_gists)
      ];

      const asciiArt = [
        "                ,@@@@@gg@ $;                 ",
        "             g @@@@@@@@@@@@@@ g,             ",
        "           ,@@@@@@@@@@@@@@@@@@@@@            ",
        "          , @@@@@@@@@@@@@@@@@@@@@@ K         ",
        "      ~@  @@@@@@@@@@@@@@@@@@@@@@@@@@g        ",
        "       $ @@@@@@@@@@@@@@@@@@@@@@@@@@@\"        ",
        "        B @@@@@@@@@@@@@@@@@@@@@@@@@          ",
        "          @@     $$$|     @@     @           ",
        "          @@@l$$$$$$@\" |$&  $$$$&@@          ",
        "          & Kl&$& W&ZL ||$$ $&&Ll            ",
        "          ]$L-\`    '|\` '\"\"'     \"$@          ",
        "           &L-     ;|   \"L;    ||T\`          ",
        "            $lLLgM||&@wy&||&&g||k\"           ",
        "             '$$@gg,,,,,,gggl$&|             ",
        "              ]$@Ll&@l||@&|l$$&              ",
        "              (&$@$LI|||||l$$$T              ",
        "              #@l$$@@llg@$$$&&lk             ",
        "             ,$$$$$$&@@&@@$$$$$$$ N,         ",
        "          ,g &$$&$$$$$ll&$$$$$$$$$ @ g       ",
        "       ,@@@@@@$$$$$$$$@@@$$$$$$$$ @@@@@@B,   ",
        "    ,g @@@@@@@ $$$$$$$$$$$$$$$$ @@@@@@@@@@@@N"
      ];

      let svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="980" height="440" font-family="Consolas, 'Courier New', monospace" font-size="14px">
    <style>
      .key {fill: ${colors.key};}
      .val {fill: ${colors.val};}
      .cc {fill: ${colors.cc};}
      text, tspan {white-space: pre;}
    </style>
    <rect width="100%" height="100%" fill="${colors.bg}" rx="10" />
  `;

      asciiArt.forEach((line, i) => {
        const y = 35 + (i * 19);
        svg += `  <text x="30" y="${y}" fill="${colors.main}">${escapeXml(line)}</text>\n`;
      });

      rightColumn.forEach((line, i) => {
        const y = 35 + (i * 19);
        svg += `  <text x="420" y="${y}">${line}</text>\n`;
      });

      svg += `</svg>`;

      fs.writeFileSync(`github_stats_${themeName}.svg`, svg);
      console.log(`SVG ${themeName} generato con successo!`);
    };

    const darkColors = {
      bg: '#0D1117',
      main: '#C9D1D9',
      key: '#E3B341',
      val: '#79C0FF',
      cc: '#8B949E' 
    };

    const lightColors = {
      bg: '#ffffff',
      main: '#24292f',
      key: '#9a6700',
      val: '#0969da',
      cc: '#57606a'
    };

    generateSVG('dark', darkColors);
    generateSVG('light', lightColors);

  } catch (error) {
    console.error("Errore:", error);
  }
}

updateStats();
