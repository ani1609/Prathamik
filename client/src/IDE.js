import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './IDE.css';

const initialFiles = [
  {
    name: "text.txt",
    language: "text",
    value: ""
  }
]

function IDE(props) {
  const [files, setFiles] = useState(initialFiles);
  const [fileIndex, setfileIndex] = useState(0);
  const editorRef = useRef(null);
  const [showAddBox, setShowAddBox] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState('');

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value) {
    props.setCode(value);
  }

  function handleAddFile() {
    const newFile = {
      name: newFileName,
      language: newFileLanguage,
    }
    if(newFileLanguage === 'javascript') {
      newFile.value = '// Enter your code here';
    } else if(newFileLanguage === 'python') {
      newFile.value = '# Enter your code here';
    } else if(newFileLanguage === 'java') {
      newFile.value = '// Enter your code here';
    } else if(newFileLanguage === 'c') {
      newFile.value = '// Enter your code here';
    } else if(newFileLanguage === 'c++') {
      newFile.value = '// Enter your code here';
    } else if(newFileLanguage === 'html') {
      newFile.value = '<!-- Enter your code here -->';
    } else if(newFileLanguage === 'css') {
      newFile.value = '/* Enter your code here */';
    } else if(newFileLanguage === 'text') {
      newFile.value = '';
    }
    setFiles([...files, newFile]);
    setShowAddBox(false);
  }

  return (
    <div>
      <button onClick={() => setShowAddBox(true)}>Add File</button>
      {showAddBox && <div className='addFilePanel' style={{ display: 'inline' }}>
        <input type='text' placeholder='Enter file name' onChange={(e) => setNewFileName(e.target.value)} />
        <select onChange={(e) => setNewFileLanguage(e.target.value)}>
          <option value='javascript'>Javascript</option>
          <option value='python'>Python</option>
          <option value='java'>Java</option>
          <option value='c'>C</option>
          <option value='c++'>C++</option>
          <option value='html'>HTML</option>
          <option value='css'>CSS</option>
          <option value='text'>Text</option>
        </select>
        <button onClick={handleAddFile}>Add</button>
      </div>}
      {files.map((file, index) =>
        index !== 0 && <button key={index} onClick={() => setfileIndex(index)}>{file.name}</button>
      )}
      <button onClick={() => props.setShow('board')}>Switch to Board</button>
      <Editor
        height="500px"
        width="900px"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        path={files[fileIndex].name}
        defaultLanguage={files[fileIndex].language}
        defaultValue={files[fileIndex].value}
      />
    </div>
  );
}

export default IDE;