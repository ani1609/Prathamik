import React, { useState, useRef , useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './IDE.css';
import '@fortawesome/fontawesome-free/css/all.css';
import io from "socket.io-client";


const socket = io.connect("http://localhost:3000");

const initialFiles = [
  {
<<<<<<< HEAD
    id: 0,
=======
>>>>>>> 22d4d3abe5c2ee00bb2274a7a92dc029614b8ad2
    name: "",
    language: "text",
    value: "",
    icon: "fab fa-js-square"
  }
];

const initialStaticFiles = [
  {
    id: 0,
    name: "index.html",
    language: ".html",
    value: "<!-- Enter your html code here -->",
    icon: "fab fa-html5"
  },
  {
    id: 1,
    name: "style.css",
    language: ".css",
    value: "/* Enter your css code here */",
    icon: "fab fa-css3-alt"
  },
  {
    id: 2,
    name: "server.js",
    language: ".js",
    value: "// Enter your js code here",
    icon: "fab fa-js-square"
  },
];

function IDE(props) {
  const [staticFiles, setStaticFiles] = useState(initialStaticFiles);
  const [files, setFiles] = useState(initialFiles);
  const [fileIndex, setfileIndex] = useState(0);
  const editorRef = useRef(null);
  const [showAddBox, setShowAddBox] = useState(false);
  const [fileId, setFileId] = useState(1);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState('html');
  const [ideValue, setIdeValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  const [user, setUser] = useState("student");

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = (e) => {
    if (showWarning) {
      e.preventDefault();
      e.returnValue = ''; // Needed for Chrome
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

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value) {
    props.setCode(value);
    socket.emit("send_value", value);
  }

  function handleFileClick()
  {
    // console.log(fileIndex);
  }

  const handleAddFile = (e) =>
  {
    const dotIndex = newFileName.indexOf('.');
    // if (dotIndex === -1)
    // {
    //   setIsInvalid(true);
    //   return;
    // }
    const fileType = newFileName.substring(dotIndex);
    setFileId((prevId) => prevId + 1);
    // console.log(fileId);
    const newFile = {
      id: fileId,
      name: newFileName,
      language: newFileLanguage,
    }

    // console.log(fileId);

    if (fileType === '.js') {
      newFile.value = '// Enter your js code here';
      newFile.icon = 'fab fa-js-square';
    } else if (fileType === '.py') {
      newFile.value = '# Enter your py code here';
      newFile.icon = 'fab fa-python';
    } else if (fileType === '.java') {
      newFile.value = '// Enter your java code here';
      newFile.icon = 'fab fa-java';
    } else if (fileType === '.c') {
      newFile.value = '// Enter your c code here';
      newFile.icon = 'fab fa-cuttlefish';
<<<<<<< HEAD
    } else if (fileType === '.cpp') {
      newFile.value = '// Enter your c++ code here';
=======
    } else if (newFileLanguage === 'cpp') {
      newFile.value = '// Enter your code here';
>>>>>>> 22d4d3abe5c2ee00bb2274a7a92dc029614b8ad2
      newFile.icon = 'fab fa-cuttlefish';
    } else if (fileType === '.html') {
      newFile.value = '<!-- Enter your html code here -->';
      newFile.icon = 'fab fa-html5';
    } else if (fileType === '.css') {
      newFile.value = '/* Enter your css code here */';
      newFile.icon = 'fab fa-css3-alt';
    } else if (fileType === '.txt') {
      newFile.value = '';
      newFile.icon = 'fas fa-file-alt';
    }
    setFiles([...files, newFile]);
    // setIsInvalid(false);
    setShowAddBox(false);
    setNewFileName('');

    socket.emit("send_file", newFile);
  }

  const inputRef = useRef(null);
  useEffect(() => {
    if (showAddBox) {
      inputRef.current.focus();
    }
  }, [showAddBox]);

  const [filesArrowRotate,setFilesArrowRotate]=useState(true);
  const [toolsArrowRotate,setToolsArrowRotate]=useState(false);
  const [filesShow,setFilesShow]=useState(true);
  const [toolsShow,setToolsShow]=useState(false);
  function handleFilesHeadingClick()
  {
    setToolsShow(false);
    setToolsArrowRotate(false);
    if (filesArrowRotate)
    {
      setFilesShow(false);
      setFilesArrowRotate(false);
    }
    else
    {
      setFilesShow(true);
      setFilesArrowRotate(true);
    }
  }

  function handleToolsHeadingClick()
  {
    setFilesShow(false);
    setFilesArrowRotate(false);
    if (toolsArrowRotate)
    {
      setToolsShow(false);
      setToolsArrowRotate(false);
    }
    else
    {
      setToolsShow(true);
      setToolsArrowRotate(true);
    }
  }

  function handleAddFileClick()
  {
    if (showAddBox)
    {
      setShowAddBox(false);
    }
    else
    {
      setShowAddBox(true);
      setFilesShow(true);
      setFilesArrowRotate(true);
      setToolsArrowRotate(false);
      setToolsShow(false);
    }
  }

  function handleFileDelete(id)
  {
    console.log(files);
    const updatedFiles = files.filter((file) => file.id !== id);
    setFiles(updatedFiles);
  }

  function handleStaticFileDelete(id)
  {
    const updatedFiles = staticFiles.filter((file) => file.id !== id);
    setStaticFiles(updatedFiles);
  }

  return (
    <div>
      <div className='ide_parent'>
<<<<<<< HEAD

        <div className='left_block'>

          <div className='files_container'>

            <div className='files_heading'>

                <div className='files_heading_left' onClick={handleFilesHeadingClick}>
                  <span className={filesArrowRotate?'arrow_rotate_down':'arrow_rotate_up'}>
                    <i class="fa-solid fa-angle-down"></i>
                  </span>
                  <h4>Files</h4>
                </div>

                <div className='files_heading_right'>
                  <span className='add_file'onClick={handleAddFileClick}>
                    <i class="fa-solid fa-file-circle-plus"></i>
                  </span>
                  <span className='three_dot'>
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                  </span>
                </div>

=======
        <div className='language_list'>
          <button onClick={() => setShowAddBox(true)}>Add File</button>
          {showAddBox && <div className='addFilePanel' style={{ display: 'inline' }}>
            <input type='text' placeholder='Enter file name' onChange={(e) => setNewFileName(e.target.value)} />
            <select onChange={(e) => setNewFileLanguage(e.target.value)} value={newFileLanguage}>
              <option value='html'>HTML</option>
              <option value='css'>CSS</option>
              <option value='javascript'>Javascript</option>
              <option value='java'>Java</option>
              <option value='cpp'>C++</option>
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
>>>>>>> 22d4d3abe5c2ee00bb2274a7a92dc029614b8ad2
            </div>

            <div className={filesShow?'files_show':'files_hide'}>
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
                          if (e.key === 'Enter')
                          {
                            e.preventDefault(); // Prevent the default form submission behavior
                            handleAddFile(e);
                          }
                        }}
                      />
                      {isInvalid && <label htmlFor='inputFileName'>Invalid file type.</label>}
                    </form>
              </div>}

              <div>
                {staticFiles.map((staticFile, index) => (
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
                  ))}
                {files.map((file, index) => (
                  <div key={index}>
                    {index !== 0 && (
                      <div className='file'>
                        <button onClick={() => {setfileIndex(index); handleFileClick()}}>
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
              {/*  onClick={handleFileDelete(file.id)} <button onClick={() => props.setShow('board')}>Switch to Board</button> */}

          </div>

          <div className='tools_container'>
            <div className='tools_heading' onClick={handleToolsHeadingClick}>
              <span className={toolsArrowRotate?'arrow_rotate_down':'arrow_rotate_up'}>
                <i class="fa-solid fa-angle-down"></i>
              </span>
              <h4>Tools</h4>
            </div>

            <div className={toolsShow?'tools_show':'tools_hide'}>

            </div>
          </div>


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
          theme="vs-dar"
          onMount={handleEditorDidMount}
          path={files[fileIndex].name}
          defaultLanguage={files[fileIndex].language}
          defaultValue={files[fileIndex].value}
          value={ideValue}
          options={{
            readOnly: true
          }}
        />}
        {ideValue}
      </div>
    </div>
  );
}

export default IDE;