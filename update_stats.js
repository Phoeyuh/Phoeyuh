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

    // --- LE TUE INFORMAZIONI ---
    const statsLines = [
      "- GitHub Stats --------------------------------------------------",
      createStatLine('. Repos:', userData.public_repos, 'Stars:', totalStars),
      createStatLine('. Followers:', userData.followers, 'Following:', userData.following),
      createStatLine('. Forks:', totalForks, 'Gists:', userData.public_gists)
    ];

    const bioText = [
      "Phoeyuh ---------------------------------------------------------",
      ". OS: ................................................ Windows 10",
      ". Host: ...................................... Lenovo LOQ 15IRX10",
      ". Role: ............................ Computer Engineering Student",
      ". IDE: .................................................. VS Code",
      ". ",
      ". Languages.Programming: .......... Java, Python, JavaScript, C++",
      ". Languages.Computer: ........................... HTML, CSS, JSON",
      ". Languages.Real: .............................. Italian, English",
      ". ",
      ". Hobbies.Software: .... Web Dev (Cloudflare, Firebase), Local AI",
      ". Hobbies.Hardware: ............. Robotics, AI-Integrated Devices",
      ". ",
      "- Contact -------------------------------------------------------",
      ". Email: .................................... phoeyuhhh@gmail.com",
      ". GitHub: ............................................... Phoeyuh",
      ". "
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
      "          ]$L-`    '|` '\"\"'     \"$@          ",
      "           &L-     ;|   \"L;    ||T`          ",
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

    const rightColumn = [...bioText, ...statsLines];
    
    let combinedText = "<!-- PROFILE:START -->\n```yaml\n";

    const totalLines = Math.max(asciiArt.length, rightColumn.length);
    for (let i = 0; i < totalLines; i++) {
      const left = asciiArt[i] || "                                             ";
      const right = rightColumn[i] || "";
      combinedText += left + "   " + right + "\n";
    }
    
    combinedText += "```\n<!-- PROFILE:END -->";

    let readmeContent = fs.readFileSync('README.md', 'utf-8');
    const regex = /<!-- PROFILE:START -->[\s\S]*?<!-- PROFILE:END -->/;
    readmeContent = readmeContent.replace(regex, combinedText);

    fs.writeFileSync('README.md', readmeContent);
    console.log("README colorato generato con successo!");

  } catch (error) {
    console.error("Errore:", error);
  }
}

updateStats();
