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

const allDocsFileContainer = document.querySelector('.all-files-uploaded-user');

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
  const allDocs = result['message'];

  const fullHTML = allDocs.map(docs => {
    const isoString = docs.date;
    const date = new Date(isoString);
    const time = date.toISOString().substring(11, 16);

    return `
      <div class="uploaded-file-container">
            <div class="uploaded-file-left-container">
                <img style="width: 28px; height: 28px;" src="/images/doc-logo.png" alt="URL Source">
                <div class="uploaded-file-left-right-container">
                    <p style="font-size: 15px; font-weight: 500;">${docs.filename}</p>
                    <p style="font-size: 12px; font-weight: 500; color: #a5a5a5;">${Math.round(Number(docs.filesize) * 10000) / 10000}MB &nbsp; • &nbsp; ${time}</p>
                </div>
            </div>
            <div class="delete-doc-parent-btn">
              <img style="height: 25px; width: 25px;" class="deleteDocBtn" data-docid="${docs.fileID}" src="/images/delete-logo.png" alt="URL Source">
            </div>
      </div>
    `;
  }).join("");

  allDocsFileContainer.innerHTML = fullHTML;


  // Stop Login Animation
  btn.innerHTML = `Upload`;
});

const allDeleteDocBtn = document.querySelectorAll('.deleteDocBtn');
const deleteDocParentBtn = document.querySelector('.delete-doc-parent-btn');

allDeleteDocBtn.forEach((button) => {
    button.addEventListener('click', async() => {
        const CONFIRM = confirm("Do you want to delete source?");

        // Current inner content
        const currentContent = deleteDocParentBtn.innerHTML;
        // Start Animation
        deleteDocParentBtn.innerHTML = `<div class="loader"></div>`;
    
        if (!CONFIRM) { return };

        const notebookID = window.location.pathname.split("/").pop();
        const fileID = button.getAttribute('data-docid');

        const formData = new FormData();
        formData.append('notebookID', notebookID)
        formData.append('fileID', fileID)
        
        // POST file and notebookID
        const response = await fetch(
            '/source/delete',
            {
            method: 'POST',
            body: formData
            }
        );

        // get_response
        const result = await response.json();

        if (!result['message']) { 
          deleteDocParentBtn.innerHTML = currentContent;
          alert("Failed to delete."); 
          return; 
        };

        const allDocs = result['message'];

        const fullHTML = allDocs.map(docs => {
            const isoString = docs.date;
            const date = new Date(isoString);
            const time = date.toISOString().substring(11, 16);

            return `
                <div class="uploaded-file-container">
                    <div class="uploaded-file-left-container">
                        <img style="width: 28px; height: 28px;" src="/images/doc-logo.png" alt="URL Source">
                        <div class="uploaded-file-left-right-container">
                            <p style="font-size: 15px; font-weight: 500;">${docs.filename}</p>
                            <p style="font-size: 12px; font-weight: 500; color: #a5a5a5;">${Math.round(Number(docs.filesize) * 10000) / 10000}MB &nbsp; • &nbsp; ${time}</p>
                        </div>
                    </div>
                    <div class="delete-doc-parent-btn">
                      <img style="height: 25px; width: 25px;" class="deleteDocBtn" data-docid="${docs.fileID}" src="/images/delete-logo.png" alt="URL Source">
                    </div>
                </div>
            `;
        }).join("");

        allDocsFileContainer.innerHTML = fullHTML;
        deleteDocParentBtn.innerHTML = currentContent;
        return;
    });
  });