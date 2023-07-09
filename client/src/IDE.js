import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './IDE.css';
import '@fortawesome/fontawesome-free/css/all.css';
import io from "socket.io-client";


const socket = io.connect("http://localhost:3000");

const initialFiles = [
  {
    id: 0,
    name: "",
    language: "text",
    value: "",
    icon: "fab fa-js-square"
  }
];

// const initialStaticFiles = [
//   {
//     id: 0,
//     name: "index.html",
//     language: ".html",
//     value: "<!-- Enter your html code here -->",
//     icon: "fab fa-html5"
//   },
//   {
//     id: 1,
//     name: "style.css",
//     language: ".css",
//     value: "/* Enter your css code here */",
//     icon: "fab fa-css3-alt"
//   },
//   {
//     id: 2,
//     name: "server.js",
//     language: ".js",
//     value: "// Enter your js code here",
//     icon: "fab fa-js-square"
//   },
// ];

function IDE(props) {
  // const [staticFiles, setStaticFiles] = useState(initialStaticFiles);
  const [files, setFiles] = useState(initialFiles);
  const [fileIndex, setfileIndex] = useState(0);
  const editorRef = useRef(null);
  const [showAddBox, setShowAddBox] = useState(false);
  const [fileId, setFileId] = useState(1);
  const [newFileName, setNewFileName] = useState('');
  const [ideValue, setIdeValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [user, setUser] = useState("teacher");

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = (e) => {
    if (showWarning) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  useEffect(() => {
    socket.on("ide_value", (data) => {
      setIdeValue(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("ide_file", (data) => {
      setFiles(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("ide_index", (data) => {
      setfileIndex(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("new_file", (data) => {
      setFiles(data);
    });
  }, [socket]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value) {
    props.setCode(value);
    socket.emit("send_value", value);
  }

  function handleFileClick(index) {
    setfileIndex((prevIndex) => {
      const updatedIndex = index;
      socket.emit("send_index", updatedIndex);
      return updatedIndex;
    });
  }

  const handleAddFile = (e) => {
    const dotIndex = newFileName.indexOf('.');
    const fileType = newFileName.substring(dotIndex);

    if (dotIndex === -1 || fileType.length === 0) {
      setIsInvalid(true);
      return;
    }

    setFileId((prevId) => prevId + 1);

    const newFile = {
      id: fileId,
      name: newFileName,
    };

    // Set the initial value and icon based on the file type
    if (fileType === '.js') {
      newFile.value = '// Enter your js code here';
      newFile.icon = 'fab fa-js-square';
      newFile.language = 'javascript';
    } else if (fileType === '.py') {
      newFile.value = '# Enter your py code here';
      newFile.icon = 'fab fa-python';
      newFile.language = 'python';
    } else if (fileType === '.java') {
      newFile.value = '// Enter your java code here';
      newFile.icon = 'fab fa-java';
      newFile.language = 'java';
    } else if (fileType === '.c') {
      newFile.value = '// Enter your c code here';
      newFile.icon = 'fab fa-cuttlefish';
      newFile.language = 'c';
    } else if (fileType === '.cpp') {
      newFile.value = '// Enter your c++ code here';
      newFile.icon = 'fab fa-cuttlefish';
      newFile.language = 'cpp';
    } else if (fileType === '.html') {
      newFile.value = '<!-- Enter your html code here -->';
      newFile.icon = 'fab fa-html5';
      newFile.language = 'html';
    } else if (fileType === '.css') {
      newFile.value = '/* Enter your css code here */';
      newFile.icon = 'fab fa-css3-alt';
      newFile.language = 'css';
    } else if (fileType === '.txt') {
      newFile.value = '';
      newFile.icon = 'fas fa-file-alt';
      newFile.language = 'text';
    }

    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, newFile];
      socket.emit("send_file", updatedFiles);
      return updatedFiles;
    });

    setIsInvalid(false);
    setShowAddBox(false);
    setNewFileName('');
  };

  const inputRef = useRef(null);
  useEffect(() => {
    if (showAddBox) {
      inputRef.current.focus();
    }
  }, [showAddBox]);

  const [filesArrowRotate, setFilesArrowRotate] = useState(true);
  const [toolsArrowRotate, setToolsArrowRotate] = useState(false);
  const [filesShow, setFilesShow] = useState(true);
  const [toolsShow, setToolsShow] = useState(false);
  function handleFilesHeadingClick() {
    setToolsShow(false);
    setToolsArrowRotate(false);
    if (filesArrowRotate) {
      setFilesShow(false);
      setFilesArrowRotate(false);
    }
    else {
      setFilesShow(true);
      setFilesArrowRotate(true);
    }
  }

  function handleToolsHeadingClick() {
    setFilesShow(false);
    setFilesArrowRotate(false);
    if (toolsArrowRotate) {
      setToolsShow(false);
      setToolsArrowRotate(false);
    }
    else {
      setToolsShow(true);
      setToolsArrowRotate(true);
    }
  }

  function handleAddFileClick() {
    if (showAddBox) {
      setShowAddBox(false);
    }
    else {
      setShowAddBox(true);
      setFilesShow(true);
      setFilesArrowRotate(true);
      setToolsArrowRotate(false);
      setToolsShow(false);
    }
  }

  function handleFileDelete(id) {
    const updatedFiles = files.filter((file) => file.id !== id);
    socket.emit("delete_file", updatedFiles);
    setFiles(updatedFiles);
  }

  // function handleStaticFileDelete(id)
  // {
  //   const updatedFiles = staticFiles.filter((file) => file.id !== id);
  //   setStaticFiles(updatedFiles);
  // }

  return (
    <div>
      <div className='ide_parent'>

        <div className='left_block'>

          <div className='files_container'>

            <div className='files_heading'>

              <div className='files_heading_left' onClick={handleFilesHeadingClick}>
                <span className={filesArrowRotate ? 'arrow_rotate_down' : 'arrow_rotate_up'}>
                  <i class="fa-solid fa-angle-down"></i>
                </span>
                <h4>Files</h4>
              </div>

              <div className='files_heading_right'>
                <span className='add_file' onClick={handleAddFileClick}>
                  <i class="fa-solid fa-file-circle-plus"></i>
                </span>
                <span className='three_dot'>
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </span>
              </div>

            </div>

            <div className={filesShow ? 'files_show' : 'files_hide'}>
              {/* <button onClick={() => setShowAddBox(true)}>Add File</button> */}
              {showAddBox && <div className='addFilePanel'>
                <form autoComplete='off'>
                  <input
                    ref={inputRef}
                    type='text'
                    placeholder='Enter file name'
                    value={newFileName}
                    id='inputFileName'
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFile(e);
                      }
                    }}
                  />
                  {isInvalid && <label htmlFor='inputFileName'>Invalid file type.</label>}
                </form>
              </div>}

              <div>
                {/* {staticFiles.map((staticFile, index) => (
                    <div key={index}>
                      <div className='file'>
                          <button>
                            {staticFile.language === 'text' ? <i className="fas fa-file-alt"></i> : <i className={`fab fa-${staticFile.icon}`}></i>}
                            {staticFile.name}
                          </button>
                          <span onClick={() => handleStaticFileDelete(staticFile.id)}>
                            <i className="fa-solid fa-trash"></i>
                          </span>
                        </div>
                    </div>
                  ))} */}
                {files.map((file, index) => (
                  <div key={index}>
                    {index !== 0 && (
                      <div className='file'>
                        <button onClick={() => handleFileClick(index)}>
                          {file.language === 'text' ? <i className="fas fa-file-alt"></i> : <i className={`fab fa-${file.icon}`}></i>}
                          {file.name}
                        </button>
                        <span onClick={() => handleFileDelete(file.id)}>
                          <i className="fa-solid fa-trash"></i>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
          <div>
            <select className='select_user' onChange={(e) => setUser(e.target.value)}>
              <option value='teacher'>Teacher</option>
              <option value="student">Student</option>
              <option value="browser">Browser</option>
            </select>
            {/* <button style={{ backgroundColor: 'white' }} onClick={() => props.setShow('board')}>Switch to Board</button> */}
          </div>

          {/* <div className='tools_container'>
            <div className='tools_heading' onClick={handleToolsHeadingClick}>
              <span className={toolsArrowRotate ? 'arrow_rotate_down' : 'arrow_rotate_up'}>
                <i class="fa-solid fa-angle-down"></i>
              </span>
              <h4>Tools</h4>
            </div>

            <div className={toolsShow ? 'tools_show' : 'tools_hide'}>

            </div>
          </div> */}


        </div>
        {user === 'teacher' && <Editor className='ide_in_ide_container'
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          path={files[fileIndex].name}
          defaultLanguage={files[fileIndex].language}
          defaultValue={files[fileIndex].value}
        />}
        {user === 'student' && <Editor className='ide_in_ide_container'
          theme="vs-light"
          onMount={handleEditorDidMount}
          path={files[fileIndex].name}
          defaultLanguage={files[fileIndex].language}
          defaultValue={files[fileIndex].value}
          value={ideValue}
          options={{
            readOnly: true
          }}
        />}
        {user === 'browser' && <iframe
          title='output'
          sandbox='allow-scripts'
          width='100%'
          height='100%'
          srcDoc={props.code}
        />}
      </div>
    </div>
  );
}

export default IDE;