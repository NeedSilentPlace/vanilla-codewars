const textarea = document.getElementById('textArea');
console.log(textarea);
CodeMirror.fromTextArea(textarea, {
  lineNumbers: true,
  theme: 'night'
});