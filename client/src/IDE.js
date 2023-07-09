import React from 'react'
import { useState , useRef} from 'react';
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

function IDE() {
  const [filename, setFilename] = useState("script.js");
  const file = files[filename];
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function getEidtorValue() {
    alert(editorRef.current.getValue());
  }

  return (
    <div>
      <button onClick={() => setFilename("index.html")}> Switch to index.html </button>
      <button onClick={() => setFilename("script.js")}> Switch to script.js </button>
      <button onClick={getEidtorValue}> Get Editor Value </button>
        <Editor
          height="500px"
          width="900px"
          theme="vs-dark"
          onMount={handleEditorDidMount}
          path={file.name}
          defaultLanguage={file.language}
          defaultValue={file.value}
        />
    </div>
  )
}

export default IDE;