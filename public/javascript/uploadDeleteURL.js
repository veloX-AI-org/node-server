const uploadURLBtnID = document.getElementById('uploadedURLBtnID');
const allURLContainer = document.querySelector('.all-url-container');

// Function to upload url content at pinecone database.
uploadURLBtnID.addEventListener("click", async() => {
    // Start Animation
    uploadURLBtnID.innerHTML = `
        <div class="dots">
            <span style="width: 5px; height: 5px; background: white;"></span>
            <span style="width: 5px; height: 5px; background: white;"></span>
            <span style="width: 5px; height: 5px; background: white;"></span>
        </div>
    `;

    // Get url
    const url = document.getElementById('urlID').value;
    
    if (!url) { 
        alert("URL required");
        uploadURLBtnID.innerHTML=`Upload`;
        return; 
    };

    // Get notebook ID
    const notebookID = window.location.pathname.split("/").pop();
    
    // POST url and notebookID
    const response = await fetch(
        '/url/upload',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                notebookID: notebookID,
                url: url
            })
        }
    );

    //get response
    const result = await response.json();
    const allURLs = result['message'];

    const fullHTML = allURLs.map(url => {  
        const dateObj = new Date(url.date);
        let hours = dateObj.getHours().toString().padStart(2, "0");
        let minutes = dateObj.getMinutes().toString().padStart(2, "0");
        const time = `${hours}:${minutes}`;
        
        return `
            <div class="url-container">
                <div class="url-left-container">
                    <img style="width: 28px; height: 28px;" src="/images/url-logo.png" alt="URL Source">
                    <div class="url-left-top-container">
                        <p style="font-size: 15px; font-weight: 500;">
                            ${getSortURL(url.url)}
                        </p>
                        <p style="font-size: 12px; font-weight: 500; color: #a5a5a5;">
                            ${url.homeUrl} &nbsp; • &nbsp; Added at ${time}
                        </p>
                    </div>
                </div>
                <img style="height: 25px; width: 25px;" src="/images/delete-logo.png" alt="URL Source">
            </div>
        `;
    }).join("");

    allURLContainer.innerHTML = fullHTML;

    // Stop  Animation
    uploadURLBtnID.innerHTML = `Upload`;
    return;
});

// Function to get home url of any url.
const getSortURL = (url) => { 
    return (url.length >= 22) ? url.slice(0, 22) + '...' : url;
};

const allURLDeleteBtns = document.querySelectorAll('.deleteURLBtn');

// Function to delete any url content from pinecone database.
allURLDeleteBtns.forEach((urlDeleteBtn) => {
    urlDeleteBtn.addEventListener("click", async() => {
        const CONFIRM = confirm("Do you want to delete source?");
        if (!CONFIRM) { return; };

        const deleteBtnParentContainer = urlDeleteBtn.closest('.delete-url-parent-btn');
        
        // Get current content
        const currentContent = deleteBtnParentContainer.innerHTML;

        // Start Animation
        deleteBtnParentContainer.innerHTML = `<div class="loader"></div>`;
        
        // Prepare headers or input for node server.
        const notebookID = window.location.pathname.split("/").pop();
        const urlID = urlDeleteBtn.getAttribute('data-docid');

        // POST urlID and notebookID
        const response = await fetch(
            '/url/delete',
            {
            method: 'POST',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify({
                notebookID: notebookID,
                urlID: urlID
            })
            }
        );

        // get_response
        const result = await response.json();

        if (!result['message']) {
          deleteBtnParentContainer.innerHTML = currentContent;
          alert("Failed to delete."); 
          return; 
        };

        const allURLs = result['message'];

        const fullHTML = allURLs.map(urls => {
            const isoString = urls.date;
            const date = new Date(isoString);
            const time = date.toISOString().substring(11, 16);

            return `
                <div class="url-container">
                    <div class="url-left-container">
                        <img style="width: 28px; height: 28px;" src="/images/url-logo.png" alt="URL Source">
                        <div class="url-left-top-container">
                            <p style="font-size: 15px; font-weight: 500;">
                                ${getSortURL(urls.url)}
                            </p>
                            <p style="font-size: 12px; font-weight: 500; color: #a5a5a5;"> ${urls.homeUrl} &nbsp; • &nbsp; Added at ${time}</p>
                        </div>
                    </div>
                    <div class="delete-url-parent-btn">
                        <img style="height: 25px; width: 25px;" class="deleteURLBtn" data-docid="${urls.urlID}" src="/images/delete-logo.png" alt="URL Source">
                    </div>
                </div>
            `;
        }).join("");

        allURLContainer.innerHTML = fullHTML;

        // Stop Animation
        deleteBtnParentContainer.innerHTML = currentContent;
        return;
    });
});