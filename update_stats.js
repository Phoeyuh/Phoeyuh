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

    const createStatLine = (label1, value1, label2, value2) => {
      const padDots = (label, value, totalWidth) => {
        const valStr = String(value);
        const dotsCount = totalWidth - label.length - valStr.length - 2; 
        const dots = '.'.repeat(Math.max(0, dotsCount));
        return `${label} ${dots} ${valStr}`;
      };

      const part1 = padDots(label1, value1, 29);
      const part2 = padDots(label2, value2, 33);
      return `${part1} | ${part2}`;
    };

    const row1 = createStatLine('. Repos:', userData.public_repos, 'Stars:', totalStars);
    const row2 = createStatLine('. Followers:', userData.followers, 'Following:', userData.following);
    const row3 = createStatLine('. Forks:', totalForks, 'Gists:', userData.public_gists);

    const newStats = `\n- GitHub Stats --------------------------------------------------\n${row1}\n${row2}\n${row3}\n`;

    let readmeContent = fs.readFileSync('README.md', 'utf-8');
    const regex = /(<!-- STATS:START -->)[\s\S]*?(<!-- STATS:END -->)/;
    readmeContent = readmeContent.replace(regex, `$1${newStats}<!-- STATS:END -->`);

    fs.writeFileSync('README.md', readmeContent);
    console.log("Aggiornamento completato!");

  } catch (error) {
    console.error("Errore:", error);
  }
}

updateStats();
