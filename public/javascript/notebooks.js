const createPopUpBtn = document.getElementById('createPopUpBtn');
const messagePopUp = document.querySelector('.invisible-container');

createPopUpBtn.addEventListener("click", () => {
    messagePopUp.style.display = 'flex';
});

const createNotebookBtn = document.getElementById('create-notebook');

createNotebookBtn.addEventListener("click", async() => {
    const notebookName = document.getElementById('notebookNameID').value;

    if (!notebookName) { return alert("Notebook name require.")};

    const response = await fetch(
        '/createNotebook',
        {
            method: 'POST',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify({ notebookName })
        }
    );

    let result = await response.json();
    messagePopUp.style.display = 'none';

    if (!result.success) {
        alert(result.message);
        return;
    }

    window.location.href = `/notebook/${result.id}`;
});

const deleteNotebook = async(element) => {
    const notebookID = element.dataset.notebookid;
    
    const deletedOrNot = await fetch (
        `/notebook/${notebookID}`,
        {
            method: "DELETE",
            headers: {
                'content-Type': 'application/json'
            }
        }
    );

    let response = await deletedOrNot.json();

    if (response.success) {
        alert(response.message);
    } else {
        alert(response.message);
    }

    window.location.reload();
};
