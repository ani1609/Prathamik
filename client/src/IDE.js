import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './IDE.css';
import '@fortawesome/fontawesome-free/css/all.css';

const initialFiles = [
  {
    name: "text.txt",
    language: "text",
    value: "",
    icon: "fas fa-file-alt"
  }
]

function IDE(props) {
  const [files, setFiles] = useState(initialFiles);
  const [fileIndex, setfileIndex] = useState(0);
  const editorRef = useRef(null);
  const [showAddBox, setShowAddBox] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState('html');

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
    if (newFileLanguage === 'javascript') {
      newFile.value = '// Enter your code here';
      newFile.icon = 'fab fa-js-square';
    } else if (newFileLanguage === 'python') {
      newFile.value = '# Enter your code here';
      newFile.icon = 'fab fa-python';
    } else if (newFileLanguage === 'java') {
      newFile.value = '// Enter your code here';
      newFile.icon = 'fab fa-java';
    } else if (newFileLanguage === 'c') {
      newFile.value = '// Enter your code here';
      newFile.icon = 'fab fa-cuttlefish';
    } else if (newFileLanguage === 'c++') {
      newFile.value = '// Enter your code here';
      newFile.icon = 'fab fa-cuttlefish';
    } else if (newFileLanguage === 'html') {
      newFile.value = '<!-- Enter your code here -->';
      newFile.icon = 'fab fa-html5';
    } else if (newFileLanguage === 'css') {
      newFile.value = '/* Enter your code here */';
      newFile.icon = 'fab fa-css3-alt';
    } else if (newFileLanguage === 'text') {
      newFile.value = '';
      newFile.icon = 'fas fa-file-alt';
    }
    setFiles([...files, newFile]);
    setShowAddBox(false);
  }

  return (
    <div>
      <div className='ide_parent'>
        <div className='language_list'>
          <button onClick={() => setShowAddBox(true)}>Add File</button>
          {showAddBox && <div className='addFilePanel' style={{ display: 'inline' }}>
            <input type='text' placeholder='Enter file name' onChange={(e) => setNewFileName(e.target.value)} />
            <select onChange={(e) => setNewFileLanguage(e.target.value)}>
              <option value='html'>HTML</option>
              <option value='css'>CSS</option>
              <option value='javascript'>Javascript</option>
              <option value='java'>Java</option>
              <option value='c++'>C++</option>
              <option value='python'>Python</option>
            </select>
            <button onClick={handleAddFile}>Add</button>
          </div>}
          {files.map((file, index) =>
            <div>
              {index !== 0 && <button key={index} onClick={() => setfileIndex(index)}>
                {file.language === 'text' ? <i className="fas fa-file-alt"></i> : <i className={`fab fa-${file.icon}`}></i>
                }
                {file.name}
              </button>}
              <div className='line'></div>
            </div>
          )}
          <button onClick={() => props.setShow('board')}>Switch to Board</button>
        </div>
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
    </div>
  );
}

export default IDE;