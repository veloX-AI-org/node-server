const sections = {
  left: document.getElementById("left-container"),
  middle: document.getElementById("middle-container"),
  right: document.getElementById("right-container"),
};

const show = (key) => {
  Object.values(sections).forEach((el) => (el.style.display = "none"));
  sections[key].style.display = "flex";
};