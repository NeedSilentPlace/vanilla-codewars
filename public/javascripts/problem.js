const submitButton = document.querySelector('.submitButton');
const textarea = document.getElementById('textArea');
const mirror = CodeMirror.fromTextArea(textarea, {
  lineNumbers: true,
  theme: 'night'
});

submitButton.addEventListener('click', ev => {
  const problemId = ev.target.dataset.id;
  const userSolution = mirror.getValue();

  fetch(`/problems/${problemId}`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answer: userSolution
    })
  })
  .then(res => res.json())
  .then(res => activeTestResult(res));
});

function activeTestResult(results) {
  const isResultShown = document.querySelector('.result');

  if(isResultShown) {
    document.querySelector('.header').removeChild(isResultShown);
  }

  if(Array.isArray(results)) {
    const resultsDiv = document.createElement('div');
    resultsDiv.classList.add('result');

    for(let i = 0; i < results.length; i++) {
      const resultDiv = document.createElement('div');

      resultDiv.classList.add(results[i][1]);
      resultDiv.textContent = `case ${i + 1} : ${results[i][0]}`;
      resultsDiv.appendChild(resultDiv);
    }

    document.querySelector('.header').appendChild(resultsDiv);
  } else {
    const resultDiv = document.createElement('div');

    resultDiv.classList.add('result');
    resultDiv.classList.add('errorMessage');
    resultDiv.textContent = results;
    document.querySelector('.header').appendChild(resultDiv);
  }
}
