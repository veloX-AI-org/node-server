const chatContainer = document.querySelector('.main-chat-container');
const postQueryBtn = document.getElementById('postUserQueryID');

// Get NotebookID From URL
const notebookID = window.location.pathname.split("/").pop();

const AIresponseOfQueryFun = async(notebookID, query) => {
    return await fetch (
        '/getAIResponse',
        {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                notebookID: notebookID,
                query: query
        })
        }
    );
};

// Create User Input Element
const CreateUserQueryElement = (text) => {
    const userQuery = document.createElement('div');
    userQuery.className = "user-input-container";
    userQuery.style.padding = "10px 20px";
    userQuery.innerText = text;
    chatContainer.appendChild(userQuery);
};

// Create AI response element and append it
const CreateAIQueryElement = (text) => {
    // Create AI Response Element Append 
    const AIResponse = document.createElement('div');
    AIResponse.className = "ai-response-container";
    AIResponse.innerHTML = text;
    chatContainer.appendChild(AIResponse);
};

// Add Necessary Animation and Block Query Post Button
const beforeQueryPostAnimation = () => {
    // Block Main Query Button
    postQueryBtn.disabled = true;
    postQueryBtn.style.cursor = "not-allowed";
    postQueryBtn.innerHTML = `<div class="loader"></div>`;

    // Create Chat Loading Animation
    chatContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="chatLoadingAnimation">
            <div style="width: 200px;" class="skeleton"></div>
            <div class="skeleton"></div>
        </div>
        `
    );
};

// Revert all loading animations to their original position
const revertToOriginalAfterQuery = () => {
    // Stop Chat Loading Animation
    document.querySelector('.chatLoadingAnimation').remove();

    // Unblock Main Query Button
    postQueryBtn.disabled = false;
    postQueryBtn.style.cursor = "pointer";
    postQueryBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.16658 16.6666V6.52075L4.49992 11.1874L3.33325 9.99992L9.99992 3.33325L16.6666 9.99992L15.4999 11.1874L10.8333 6.52075V16.6666H9.16658Z" fill="white"/>
    </svg>
    `;
};

// Scroll to bottom 
function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
};

// Get Query Response For Follow-up Questions
async function queryFollowupQuestion(followUpQuestion) {
    // Get Query and NotebookID
    const followUpQuery = followUpQuestion.innerText;

    // Create User Query Element
    CreateUserQueryElement(followUpQuery);

    // Add Necessary Aimation and Block Query Post Button
    beforeQueryPostAnimation();

    scrollToBottom();

    // Post response to node server and get output
    try {
        const AIresponseOfFollowUpQuery = await AIresponseOfQueryFun(
            notebookID,
            followUpQuery
        );

        revertToOriginalAfterQuery();

        // Get AI response from node server
        const response = await AIresponseOfFollowUpQuery.json();

        // Append AI response into chat container
        CreateAIQueryElement(response.data);

        scrollToBottom();
    } catch (error) {
        console.log(error);
    }
};

// Get query response by user's question
postQueryBtn.addEventListener("click", async() => {
    const query = document.getElementById("userQueryID").value;
    if (!query) return alert("Query Required"); // validate Input Query

    document.getElementById("userQueryID").value = "";

    // Create User Input Element
    CreateUserQueryElement(query);

    // Add Necessary Aimation and Block Query Post Button
    beforeQueryPostAnimation();

    scrollToBottom();

    // Post response to node server and get streamed output
    try {
        const AIresponseOfFollowUpQuery = await AIresponseOfQueryFun(
            notebookID,
            query
        )

        revertToOriginalAfterQuery();

        const response = await AIresponseOfFollowUpQuery.json();

        // Create AI Response Element Append IT
        CreateAIQueryElement(response.data);

        scrollToBottom();
    } catch (error) {
        console.log(error);
    }
});