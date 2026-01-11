const sections = {
  left: document.getElementById('left-container'),
  middle: document.getElementById('middle-container'),
  right: document.getElementById('right-container'),
};

const show = (key) => {
  Object.values(sections).forEach(el => el.style.display = 'none');
  sections[key].style.display = 'flex';
};

// const box = document.querySelector('.upload-box');

// box.addEventListener('dragover', e => {
//     e.preventDefault();
//     box.classList.add('dragover');
// });

// box.addEventListener('dragleave', () => {
//     box.classList.remove('dragover');
// });

// box.addEventListener('drop', () => {
//     box.classList.remove('dragover');
// });