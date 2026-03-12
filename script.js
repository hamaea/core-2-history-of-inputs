const editorPage = document.getElementById("editorPage");
const documentNameInput = document.getElementById("documentName");
const pageTitle = document.getElementById("pageTitle");
const saveStatus = document.getElementById("saveStatus");
const lineSpacing = document.getElementById("lineSpacing");
const lineSpacingValue = document.getElementById("lineSpacingValue");
const fontFamily = document.getElementById("fontFamily");
const textColor = document.getElementById("textColor");
const highlightColor = document.getElementById("highlightColor");
const listToggles = ["checklistToggle", "bulletToggle", "numberToggle"];

let currentFontSize = 18;

function focusEditor() {
  editorPage.focus();
}

function runCommand(command, value = null) {
  focusEditor();
  document.execCommand(command, false, value);
}

function setSaveStatus(text) {
  saveStatus.textContent = text;
}

function syncDocumentTitle() {
  const title = documentNameInput.value.trim() || "Untitled document";
  pageTitle.textContent = title;
  document.title = `${title} | Document Editor Scaffold`;
}

function markDirty() {
  setSaveStatus("Unsaved changes");
}

function setFontSize(nextSize) {
  currentFontSize = Math.max(10, Math.min(48, nextSize));
  editorPage.style.fontSize = `${currentFontSize}px`;
  markDirty();
}

function setAlignment(alignment) {
  editorPage.style.textAlign = alignment;
  markDirty();
}

function toggleExclusiveList(activeId, command) {
  listToggles.forEach((id) => {
    if (id !== activeId) {
      document.getElementById(id).checked = false;
    }
  });

  runCommand(command);
  markDirty();
}

document.getElementById("undoButton").addEventListener("click", () => runCommand("undo"));
document.getElementById("redoButton").addEventListener("click", () => runCommand("redo"));

document.getElementById("saveButton").addEventListener("click", () => {
  syncDocumentTitle();
  setSaveStatus(`Saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
});

document.getElementById("printButton").addEventListener("click", () => window.print());

document.getElementById("fontSizeUp").addEventListener("click", () => setFontSize(currentFontSize + 2));
document.getElementById("fontSizeDown").addEventListener("click", () => setFontSize(currentFontSize - 2));

document.getElementById("boldToggle").addEventListener("change", () => {
  runCommand("bold");
  markDirty();
});

document.getElementById("italicToggle").addEventListener("change", () => {
  runCommand("italic");
  markDirty();
});

document.getElementById("underlineToggle").addEventListener("change", () => {
  runCommand("underline");
  markDirty();
});

fontFamily.addEventListener("change", () => {
  editorPage.style.fontFamily = fontFamily.value;
  markDirty();
});

textColor.addEventListener("input", () => {
  runCommand("foreColor", textColor.value);
  markDirty();
});

highlightColor.addEventListener("input", () => {
  runCommand("hiliteColor", highlightColor.value);
  markDirty();
});

document.querySelectorAll('input[name="alignment"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      setAlignment(radio.value);
    }
  });
});

lineSpacing.addEventListener("input", () => {
  editorPage.style.lineHeight = lineSpacing.value;
  lineSpacingValue.textContent = `${lineSpacing.value}x`;
  markDirty();
});

document.getElementById("checklistToggle").addEventListener("change", (event) => {
  if (!event.target.checked) {
    return;
  }

  toggleExclusiveList("checklistToggle", "insertUnorderedList");
  document.execCommand("insertHTML", false, "<li><input type='checkbox'> Checklist item</li>");
});

document.getElementById("bulletToggle").addEventListener("change", (event) => {
  if (!event.target.checked) {
    return;
  }

  toggleExclusiveList("bulletToggle", "insertUnorderedList");
});

document.getElementById("numberToggle").addEventListener("change", (event) => {
  if (!event.target.checked) {
    return;
  }

  toggleExclusiveList("numberToggle", "insertOrderedList");
});

document.getElementById("indentIncrease").addEventListener("click", () => {
  runCommand("indent");
  markDirty();
});

document.getElementById("indentDecrease").addEventListener("click", () => {
  runCommand("outdent");
  markDirty();
});

document.getElementById("clearFormatting").addEventListener("click", () => {
  runCommand("removeFormat");
  markDirty();
});

document.getElementById("insertLink").addEventListener("change", (event) => {
  const url = event.target.value.trim();
  if (!url) {
    return;
  }

  runCommand("createLink", url);
  event.target.value = "";
  markDirty();
});

document.getElementById("insertImage").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    focusEditor();
    document.execCommand("insertImage", false, reader.result);
    markDirty();
  };
  reader.readAsDataURL(file);
});

documentNameInput.addEventListener("input", () => {
  syncDocumentTitle();
  markDirty();
});

editorPage.addEventListener("input", markDirty);

syncDocumentTitle();
setFontSize(currentFontSize);
editorPage.style.lineHeight = lineSpacing.value;
lineSpacingValue.textContent = `${lineSpacing.value}x`;
