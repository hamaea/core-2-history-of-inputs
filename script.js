const editorPage = document.getElementById("editorPage");
const undoButtons = document.querySelectorAll("[data-undo-button]");

function focusEditor() {
  editorPage.focus();
}

function runUndo() {
  focusEditor();
  document.execCommand("undo", false);
}

undoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    runUndo();
  });
});
