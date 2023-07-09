import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './IDE.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { db } from './firebase_config';
import { collection, getDoc, getDocs, doc, where, query, updateDoc, addDoc } from 'firebase/firestore';

const initialFiles = [
  {
    id: 0,
    name: "",
    language: "text",
    value: "",
    icon: "fab fa-js-square",
    other: "text"
  }
];

function IDE(props) {
  const [files, setFiles] = useState(initialFiles);
  const [fileIndex, setfileIndex] = useState(0);
  const editorRef = useRef(null);
  const [showAddBox, setShowAddBox] = useState(false);
  const [fileId, setFileId] = useState(1);
  const [newFileName, setNewFileName] = useState('');
  const [ideValue, setIdeValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [fileValues, setFileValues] = useState({});
  const collectionRef = collection(db, "FileSystemX");

  useEffect(() => {
    const addDocument = async () => {
      const q = query(collectionRef, where("room_id", "==", props.meetingId));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        return;
      }

      await addDoc(collectionRef, { files: files, room_id: props.meetingId });
    };
  
    addDocument();
  }, []);

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
    const newFileValues = {};
    files.forEach((file) => {
      newFileValues[file.id] = file.value;
    });
    setFileValues(newFileValues);
  }, [files]);

  useEffect(() => {
    props.socket.on("show-browser", (data) => {
      props.setShowBrowser(data);
    });

    return () => {
      props.socket.off("show-browser");
    }
  }, [props.socket]);

  useEffect(() => {
    props.socket.on("ide_value", (data) => {
      props.setCode(data);
      setIdeValue(data);
    });
  }, [props.socket]);

  useEffect(() => {
    props.socket.on("ide_file", (data) => {
      setFiles(data);
    });

    return () => {
      props.socket.off("ide_file");
    }
  }, [props.socket]);

  useEffect(() => {
    props.socket.on("ide_index", (data) => {
      setfileIndex(data);
    });

    return () => {
      props.socket.off("ide_index");
    }
  }, [props.socket]);

  useEffect(() => {
    props.socket.on("new_file", (data) => {
      setFiles(data);
    });

    return () => {
      props.socket.off("new_file");
    }
  }, [props.socket]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value) {
    props.setCode(value);

    const updatedFiles = [...files];
    updatedFiles[fileIndex].value = value;

    setFiles(updatedFiles);
    props.socket.emit("send_value", { value: value, roomid: props.meetingId });
  }

  function handleFileClick(index) {
    setfileIndex((prevIndex) => {
      const updatedIndex = index;
      props.socket.emit("send_index", { value: updatedIndex, roomid: props.meetingId });
      return updatedIndex;
    });

    props.setCurrentLanguage(files[index].other);
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

    if (fileType === '.js') {
      newFile.value = '// Enter your js code here';
      newFile.icon = 'fab fa-js-square';
      newFile.language = 'javascript';
      newFile.other = 'javascript';
    } else if (fileType === '.py') {
      newFile.value = '# Enter your py code here';
      newFile.icon = 'fab fa-python';
      newFile.language = 'python';
      newFile.other = 'python3';
    } else if (fileType === '.java') {
      newFile.value = '// Enter your java code here';
      newFile.icon = 'fab fa-java';
      newFile.language = 'java';
      newFile.other = 'java';
    } else if (fileType === '.c') {
      newFile.value = '// Enter your c code here';
      newFile.icon = 'fab fa-cuttlefish';
      newFile.language = 'c';
      newFile.other = 'c';
    } else if (fileType === '.cpp') {
      newFile.value = '// Enter your c++ code here';
      newFile.icon = 'fab fa-cuttlefish';
      newFile.language = 'cpp';
      newFile.other = 'cpp';
    } else if (fileType === '.html') {
      newFile.value = '<!-- Enter your html code here -->';
      newFile.icon = 'fab fa-html5';
      newFile.language = 'html';
      newFile.other = 'html';
    } else if (fileType === '.css') {
      newFile.value = '/* Enter your css code here */';
      newFile.icon = 'fab fa-css3-alt';
      newFile.language = 'css';
      newFile.other = 'css';
    } else if (fileType === '.txt') {
      newFile.value = '';
      newFile.icon = 'fas fa-file-alt';
      newFile.language = 'text';
      newFile.other = 'text';
    }

    let updatedFiles;

    setFiles((prevFiles) => {
      updatedFiles = [...prevFiles, newFile];
      props.socket.emit("send_file", { value: updatedFiles, roomid: props.meetingId });
      return updatedFiles;
    });

    // const addNewFile = async () => {
    //   const fileData = {
    //     name: newFile.name,
    //     value: newFile.value,
    //     id: newFile.id,
    //     language: newFile.language,
    //     other: newFile.other,
    //     icon: newFile.icon,
    //   };
    
    //   const roomId = props.meetingId;
    //   const docRef = doc(roomId[index]);
    
    //   await updateDoc(collection(roomDocRef, 'files'), fileData);
    // };

    // addNewFile();

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
    props.socket.emit("delete_file", { value: updatedFiles, roomid: props.meetingId });
    setFiles(updatedFiles);
  }

  function handleInputValue(e) {
    props.setInput(e.target.value);
    props.socket.emit("input", { value: e.target.value, roomid: props.meetingId });
  }

  return (
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
        </div>

        {props.details.isAdmin && !props.showBrowser &&
          <div className='ide_in_ide_container'>
            <Editor
              theme="vs-light"
              onMount={handleEditorDidMount}
              onChange={handleEditorChange}
              path={files[fileIndex].name}
              defaultLanguage={files[fileIndex].language}
              value={fileValues[files[fileIndex].id]}
              className='mainIde'
            />
            <div className="inputNoutput">
              <div className="inputF">
                <h4>Input</h4>
                <textarea
                  value={props.input}
                  onChange={(e) => { handleInputValue(e) }}
                />
              </div>
              <div className="outputF">
                <h4>Output</h4>
                <textarea
                  value={props.output}
                  readOnly
                />
              </div>
            </div>
          </div>
        }
        {!props.details.isAdmin && !props.showBrowser && <div className='ide_in_ide_container'>
          <Editor theme="vs-light" onMount={handleEditorDidMount} path={files[fileIndex].name}
            defaultLanguage={files[fileIndex].language} defaultValue={files[fileIndex].value} value={ideValue} options={{
              readOnly: true
            }} />
          <div className="inputNoutput">
            <div className="inputF">
              <h4>Input</h4>
              <textarea value={props.input} onChange={(e) => props.setInput(e.target.value)}
              />
            </div>
            <div className="outputF">
              <h4>Output</h4>
              <textarea
                value={props.output}
                readOnly
              />
            </div>
          </div>
        </div>}
        {props.showBrowser && <iframe
          title='output'
          sandbox='allow-scripts'
          width='100%'
          height='100%'
          srcDoc={props.code}
          className='iframe'
        />}
      </div>
  );
}

export default IDE;