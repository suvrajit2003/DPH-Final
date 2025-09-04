
import React, { useRef, useState, useEffect } from "react";
import {
  Bold, Italic, Underline, Strikethrough, Paintbrush2,
  List, ListOrdered, AlignLeft, Table, Link2, Image as ImageIcon,
  Code, XCircle, HelpCircle
} from "lucide-react";
import ToolbarButton from "./ToolbarButton"; // Assumes ToolbarButton is in a separate file

const RichTextEditor = ({ value, onChange, placeholder, error }) => {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState(new Set());

  // This useEffect prevents the "reversed text" bug by only setting HTML
  // if the value prop is different from the editor's current content.
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && value !== editor.innerHTML) {
      editor.innerHTML = value || "";
    }
  }, [value]);

  const updateActiveFormats = () => {
    const formats = new Set();
    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    if (document.queryCommandState("strikeThrough")) formats.add("strikeThrough");
    if (document.queryCommandState("insertOrderedList")) formats.add("insertOrderedList");
    if (document.queryCommandState("insertUnorderedList")) formats.add("insertUnorderedList");
    setActiveFormats(formats);
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    updateActiveFormats();
  };

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) executeCommand("createLink", url);
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) executeCommand("insertImage", url);
  };

  const insertTable = () => {
    const rows = parseInt(prompt("Number of rows:") || 2, 10);
    const cols = parseInt(prompt("Number of columns:") || 2, 10);
    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) return;
    
    let table = '<table style="border-collapse: collapse; width: 100%; border: 1px solid #ccc;">';
    for (let i = 0; i < rows; i++) {
      table += "<tr>";
      for (let j = 0; j < cols; j++) {
        table += '<td style="padding: 8px; border: 1px solid #ccc;">&nbsp;</td>';
      }
      table += "</tr>";
    }
    table += "</table>";
    executeCommand("insertHTML", table);
  };

  // Conditionally set classes for the border based on the error prop
  const containerClasses = `w-full border rounded-md focus-within:ring-2 focus-within:ring-blue-500 ${
    error ? 'border-red-500' : 'border-gray-300'
  }`;
  
  const editorClasses = `w-full px-3 py-3 min-h-[160px] bg-white overflow-y-auto relative rounded-b-md outline-none`;

  return (
    <div className="w-full">
      <div className={containerClasses}>
        <div className="px-2 py-1.5 bg-gray-50 flex items-center gap-1 border-b flex-wrap rounded-t-md">
            <ToolbarButton title="Bold" icon={Bold} active={activeFormats.has("bold")} onClick={() => executeCommand("bold")} />
            <ToolbarButton title="Italic" icon={Italic} active={activeFormats.has("italic")} onClick={() => executeCommand("italic")} />
            <ToolbarButton title="Underline" icon={Underline} active={activeFormats.has("underline")} onClick={() => executeCommand("underline")} />
            <ToolbarButton title="Strikethrough" icon={Strikethrough} active={activeFormats.has("strikeThrough")} onClick={() => executeCommand("strikeThrough")} />
            <ToolbarButton title="Text Color" icon={Paintbrush2} onClick={() => {
              const color = prompt("Enter color (e.g., #FF0000 or red):");
              if (color) executeCommand("foreColor", color);
            }} />
            <ToolbarButton title="Unordered List" icon={List} active={activeFormats.has("insertUnorderedList")} onClick={() => executeCommand("insertUnorderedList")} />
            <ToolbarButton title="Ordered List" icon={ListOrdered} active={activeFormats.has("insertOrderedList")} onClick={() => executeCommand("insertOrderedList")} />
            <ToolbarButton title="Align Left" icon={AlignLeft} onClick={() => executeCommand("justifyLeft")} />
            <ToolbarButton title="Insert Table" icon={Table} onClick={insertTable} />
            <ToolbarButton title="Insert Link" icon={Link2} onClick={insertLink} />
            <ToolbarButton title="Insert Image" icon={ImageIcon} onClick={insertImage} />
            <ToolbarButton title="Code Block" icon={Code} onClick={() => executeCommand("formatBlock", "pre")} />
            <ToolbarButton title="Clear Formatting" icon={XCircle} onClick={() => executeCommand("removeFormat")} />
            <ToolbarButton title="Help" icon={HelpCircle} onClick={() => {
              alert("Shortcuts:\nCtrl+B: Bold\nCtrl+I: Italic\nCtrl+U: Underline");
            }} />
        </div>

        <div
          ref={editorRef}
          contentEditable
          dir="ltr"
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onFocus={updateActiveFormats}
          suppressContentEditableWarning
          className={editorClasses}
        >
        </div>
      </div>
      
      {/* Display the error message if it exists */}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default RichTextEditor;