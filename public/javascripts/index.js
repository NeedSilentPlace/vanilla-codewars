const levels = document.querySelectorAll('.level');

for(let i = 0; i < levels.length; i++) {
  levels[i].addEventListener('click', ev => {
    const level = ev.target.dataset.level;

    fetch(`/?difficulty_level=${level}`)
      .then(res => res.json())
      .then(res => sortVisualizer(res));
  });
}

function sortVisualizer(data) {
  const problemContainer = document.querySelector('.problemContainer');
  
  while(problemContainer.children.length !== 0) {
    problemContainer.removeChild(problemContainer.children[0]);
  }

  for(let i = 0; i < data.length; i++) {
    const problem = document.createElement('div');
    const header = document.createElement('div');
    const level = document.createElement('div');
    const title = document.createElement('div');
    const titleLink = document.createElement('a');
    const solved = document.createElement('div');
    const description = document.createElement('div');

    problem.classList.add('problem');
    header.classList.add('problemHeader');
    level.textContent = `Level ${data[i].difficulty_level}`;
    
    titleLink.href = `/problems/${data[i]._id}`;
    titleLink.textContent = data[i].title;
    title.appendChild(titleLink);
    solved.textContent = `${data[i].solution_count} solved`;
    
    header.appendChild(level);
    header.appendChild(title);
    header.appendChild(solved);

    description.textContent = data[i].description;
    
    problem.appendChild(header);
    problem.appendChild(description);
    problemContainer.appendChild(problem);
  }
}
