const input = document.getElementById("fileInput");
const button = document.getElementById("customButton");
const fileName = document.getElementById("fileName");

button.addEventListener("click", () => input.click());

input.addEventListener("change", () => {
  fileName.textContent = input.files.length
    ? input.files[0].name
    : "No file chosen";
});

const btn = document.getElementById("uploadDocSourceBtn");
const file = document.getElementById('fileInput');

btn.addEventListener("click", async(req, res) => {
  // Start Loading Animation
  btn.innerHTML = `
    <div class="dots">
        <span style="width: 7px; height: 7px; background: white;"></span>
        <span style="width: 7px; height: 7px; background: white;"></span>
        <span style="width: 7px; height: 7px; background: white;"></span>
    </div>
  `;

  if (!file.files.length) { return alert("No file selected!") };

  // Create Form
  const formData = new FormData();
  const notebookID = window.location.pathname.split("/").pop();
  
  formData.append("file", file.files[0]);
  formData.append("notebookID", notebookID);
  
  // POST file and notebookID
  const response = await fetch(
    '/source/upload',
    {
      method: 'POST',
      body: formData
    }
  );

  // get_response
  const result = await response.json();

  // Stop Login Animation
  btn.innerHTML = `Upload`;
});