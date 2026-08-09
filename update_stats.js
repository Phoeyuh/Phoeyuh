const fs = require('fs');

async function updateStats() {
  const username = 'Phoeyuh'; 
  const token = process.env.GH_TOKEN; 

  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    const userRes = await fetch(`[https://api.github.com/users/$](https://api.github.com/users/$){username}`, { headers });
    const userData = await userRes.json();

    const reposRes = await fetch(`[https://api.github.com/users/$](https://api.github.com/users/$){username}/repos?per_page=100`, { headers });
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

    const leftColumnText = `                ,@@@@@gg@ $;                 
             g @@@@@@@@@@@@@@ g,             
           ,@@@@@@@@@@@@@@@@@@@@@            
          , @@@@@@@@@@@@@@@@@@@@@@ K         
      ~@  @@@@@@@@@@@@@@@@@@@@@@@@@@g        
       $ @@@@@@@@@@@@@@@@@@@@@@@@@@@"        
        B @@@@@@@@@@@@@@@@@@@@@@@@@          
          @@     $$$|     @@     @           
          @@@l$$$$$$@" |$&  $$$$&@@          
          & Kl&$& W&ZL ||$$ $&&Ll            
          ]$L-`    '|` '""'     "$@          
           &L-     ;|   "L;    ||T`          
            $lLLgM||&@wy&||&&g||k"           
             '$$@gg,,,,,,gggl$&|             
              ]$@Ll&@l||@&|l$$&              
              (&$@$LI|||||l$$$T              
              #@l$$@@llg@$$$&&lk             
             ,$$$$$$&@@&@@$$$$$$$ N,         
          ,g &$$&$$$$$ll&$$$$$$$$$ @ g       
       ,@@@@@@$$$$$$$$@@@$$$$$$$$ @@@@@@B,   
    ,g @@@@@@@ $$$$$$$$$$$$$$$$ @@@@@@@@@@@@N`;

    // Colonna di Destra: Bio e Statistiche
    const rightColumnText = `Phoeyuh ---------------------------------------------------------
. OS: ................................................ Windows 10
. Host: ...................................... Lenovo LOQ 15IRX10
. Role: ............................ Computer Engineering Student
. IDE: .................................................. VS Code
. 
. Languages.Programming: .......... Java, Python, JavaScript, C++
. Languages.Computer: ........................... HTML, CSS, JSON
. Languages.Real: .............................. Italian, English
. 
. Hobbies.Software: .... Web Dev (Cloudflare, Firebase), Local AI
. Hobbies.Hardware: ............. Robotics, AI-Integrated Devices
. 
- Contact -------------------------------------------------------
. Email: .................................... phoeyuhhh@gmail.com
. GitHub: ............................................... Phoeyuh
. 
- GitHub Stats --------------------------------------------------
${row1}
${row2}
${row3}`;

    // Assemblaggio della tabella HTML con i blocchi YAML integrati
    const newHtml = `<!-- PROFILE:START -->
<div align="center">
  <table>
    <tr>
      <td valign="top">

\`\`\`yaml
${leftColumnText}
\`\`\`

      </td>
      <td valign="top">

\`\`\`yaml
${rightColumnText}
\`\`\`

      </td>
    </tr>
  </table>
</div>
<!-- PROFILE:END -->`;

    let readmeContent = fs.readFileSync('README.md', 'utf-8');
    const regex = /<!-- PROFILE:START -->[\s\S]*?<!-- PROFILE:END -->/;
    
    if (regex.test(readmeContent)) {
        readmeContent = readmeContent.replace(regex, newHtml);
    } else {
        readmeContent = newHtml;
    }

    fs.writeFileSync('README.md', readmeContent);
    console.log("README aggiornato e impaginato correttamente!");

  } catch (error) {
    console.error("Errore:", error);
  }
}

updateStats();
