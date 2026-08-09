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

    const createRow = (key, value) => {
      const dotsLen = 65 - key.length - value.length - 2;
      return `<tspan fill="#E3B341">${key}</tspan><tspan fill="#8B949E"> ${'.'.repeat(Math.max(0, dotsLen))} </tspan><tspan fill="#79C0FF">${value}</tspan>`;
    };

    const createDoubleRow = (k1, v1, k2, v2) => {
      const c1Dots = 29 - k1.length - String(v1).length - 2;
      const part1 = `<tspan fill="#E3B341">${k1}</tspan><tspan fill="#8B949E"> ${'.'.repeat(Math.max(0, c1Dots))} </tspan><tspan fill="#79C0FF">${v1}</tspan>`;
      
      const c2Dots = 33 - k2.length - String(v2).length - 2;
      const part2 = `<tspan fill="#E3B341">${k2}</tspan><tspan fill="#8B949E"> ${'.'.repeat(Math.max(0, c2Dots))} </tspan><tspan fill="#79C0FF">${v2}</tspan>`;
      
      return `${part1}<tspan fill="#8B949E"> | </tspan>${part2}`;
    };

    const rightColumn = [
      `<tspan fill="#C9D1D9">Phoeyuh </tspan><tspan fill="#8B949E">${'-'.repeat(57)}</tspan>`,
      createRow('. OS:', 'Windows 10'),
      createRow('. Host:', 'Lenovo LOQ 15IRX10'),
      createRow('. Role:', 'Computer Engineering Student'),
      createRow('. IDE:', 'VS Code'),
      `<tspan fill="#8B949E">.</tspan>`,
      createRow('. Languages.Programming:', 'Java, Python, JavaScript, C++'),
      createRow('. Languages.Computer:', 'HTML, CSS, JSON'),
      createRow('. Languages.Real:', 'Italian, English'),
      `<tspan fill="#8B949E">.</tspan>`,
      createRow('. Hobbies.Software:', 'Web Dev (Cloudflare, Firebase), Local AI'),
      createRow('. Hobbies.Hardware:', 'Robotics, AI-Integrated Devices'),
      `<tspan fill="#8B949E">.</tspan>`,
      `<tspan fill="#C9D1D9">- Contact </tspan><tspan fill="#8B949E">${'-'.repeat(55)}</tspan>`,
      createRow('. Email:', 'phoeyuhhh@gmail.com'),
      createRow('. GitHub:', 'Phoeyuh'),
      `<tspan fill="#8B949E">.</tspan>`,
      `<tspan fill="#C9D1D9">- GitHub Stats </tspan><tspan fill="#8B949E">${'-'.repeat(50)}</tspan>`,
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

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="980" height="440">
  <rect width="100%" height="100%" fill="#0D1117" rx="10" />
  <g font-family="Consolas, 'Courier New', monospace" font-size="14px">
`;

    asciiArt.forEach((line, i) => {
      const y = 35 + (i * 19);
      svg += `    <text x="30" y="${y}" fill="#C9D1D9" xml:space="preserve">${line}</text>\n`;
    });

    rightColumn.forEach((line, i) => {
      const y = 35 + (i * 19);
      svg += `    <text x="420" y="${y}" xml:space="preserve">${line}</text>\n`;
    });

    svg += `  </g>\n</svg>`;

    fs.writeFileSync('github_stats.svg', svg);
    console.log("SVG generato con successo!");

  } catch (error) {
    console.error("Errore:", error);
  }
}

updateStats();
