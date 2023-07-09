import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './IDE.css';

const files = {
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: "// Start Writing code from here.."
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: "<!-- Start Writing code from here.. -->"
  }
}

function IDE(props) {
  const [filename, setFilename] = useState("script.js");
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value) {
    props.setCode(value);
  }

  function getEditorValue() {
    alert(editorRef.current.getValue());
  }

  return (
    <div>
      <button onClick={() => setFilename("index.html")}>Switch to index.html</button>
      <button onClick={() => setFilename("script.js")}>Switch to script.js</button>
      <button onClick={getEditorValue}>Get Editor Value</button>
      <button onClick={() => props.setShow('board')}>Switch to Board</button>
      <Editor
        height="500px"
        width="900px"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        path={files[filename].name}
        defaultLanguage={files[filename].language}
        defaultValue={files[filename].value}
      />
    </div>
  );
}

export default IDE;