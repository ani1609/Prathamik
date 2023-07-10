import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './IDE.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { db } from './firebase_config';

import { collection, getDoc, getDocs, doc, where, query, updateDoc, addDoc, onSnapshot, deleteDoc} from 'firebase/firestore';

const initialFiles = [
  {
    id: 0,
    name: "sample.txt",
    language: "text",
    value: "This is a sample file.",
    icon: "fab fa-js-square",
    other: "text"
  }
];

function IDE(props) {
  const [f, setF] = useState([]);
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
  const roomId = props.meetingId;
  const collectionRef = collection(db, roomId);
  const [fileName, setFileName]=useState("");
  // const collectionRef = collection(db, "FileSystemX");

  useEffect(() => {
    const addDocument = async () => {
      try {
        const querySnapshot = await getDocs(collectionRef);
        if (!querySnapshot.empty) {
          console.log("Meeting ID already exists in the database.");
        } else {
          // Create a new document with the meeting ID
          console.log("Creating new data entry:");
          const docRef = await addDoc(collectionRef, initialFiles[0]);
          console.log("New data entry created successfully. Document ID:", docRef.id);
        }
      } catch (error) {
        console.error("Error creating new data entry:", error);
      }
    };
  
    addDocument();
  }, []);

  useEffect(() => {
    const roomId = props.meetingId;
    const collectionRef = collection(db, roomId);
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      setFiles(snapshot.docs.map((doc) => {
        const data = doc.data();
        return data;
      }));
    });
  
    return () => {
      // Unsubscribe from real-time updates when the component unmounts
      unsubscribe();
    };
  }, [props.meetingId]);

  useEffect(() => {
    getDocs(collectionRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("------Document ID:", doc.id);
        const data = doc.data();
        console.log(data.files.name);
      });
  })
  .catch((error) => {
    console.log("Error getting documents: ", error);
  });
  }, [collectionRef]);

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

  async function handleEditorChange(value) 
  {
    getDocs(collectionRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const entry = doc.data();
        if (entry.name === fileName) {
          // Update the entry with the new values
          updateDoc(doc.ref, {
            value: value,
            // Update other parameters as required
          })
            .then(() => {
              console.log("Entry updated successfully.");
            })
            .catch((error) => {
              console.error("Error updating entry:", error);
            });
        }
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });


    props.setCode(value);

    const updatedFiles = [...files];
    updatedFiles[fileIndex].value = value;

    setFiles(updatedFiles);
    props.socket.emit("send_value", { value: value, roomid: props.meetingId });
  }

  async function handleFileClick(index) 
  {
    console.log(files);
    setFileName(files[index].name);
    setfileIndex((prevIndex) => {
      const updatedIndex = index;
      props.socket.emit("send_index", { value: updatedIndex, roomid: props.meetingId });
      return updatedIndex;
    });

    props.setCurrentLanguage(files[index].other);
  }

  const handleAddFile = async (e) => {
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
    else
    {
      setIsInvalid(true);
      return;
    }

    let updatedFiles;

    setFiles((prevFiles) => {
      updatedFiles = [...prevFiles, newFile];
      props.socket.emit("send_file", { value: updatedFiles, roomid: props.meetingId });
      return updatedFiles;
    });

    const roomId = props.meetingId;
    const collectionRef = collection(db, roomId);
    const querySnapshot = await getDocs(collectionRef);
    const collectionSize = querySnapshot.size;
    getDocs(collectionRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Print each entry
        console.log("Unique ID:", doc.id);
        console.log(doc.data());
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
    console.log("files----",querySnapshot);

    const addNewFile = async () => {
      const fileData = {
        name: newFile.name,
        value: newFile.value,
        id: collectionSize,
        language: newFile.language,
        other: newFile.other,
        icon: newFile.icon,
      };
    
      
    
      const uploadFile = async () => {
        try {
          await addDoc(collectionRef, fileData);
          // console.log('File uploaded successfully!');
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
      
      uploadFile();

      const querySnapshot = await getDocs(collectionRef);
      setF(querySnapshot.docs.map((doc) => {
        return doc.data();
      }));

    };

    addNewFile();

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

  function handleFileDelete(nameToDelete) 
  {
    setfileIndex(0);
    getDocs(collectionRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const entry = doc.data();
        if (entry.name === nameToDelete) {
          deleteDoc(doc.ref)
            .then(() => {
              console.log("Entry with file name deleted. ID:", doc.id);
            })
            .catch((error) => {
              console.error("Error deleting entry:", error);
            });
        }
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });


    const updatedFiles = files.filter((file) => file.name !== nameToDelete);
    props.socket.emit("delete_file", { value: updatedFiles, roomid: props.meetingId });
    setFiles(updatedFiles);
  }

  function handleInputValue(e) {
    props.setInput(e.target.value);
    props.socket.emit("input", { value: e.target.value, roomid: props.meetingId });
  }

  // function handleShowBrowser(value) {
  //   setShowBrowser(value);
  //   props.socket.emit("show-browser", {value: value , roomid: props.meetingId});
  // }


  // const roomId = props.meetingId;
  // const collectionRef = collection(db, roomId);
  // const querySnapshot = getDocs(collectionRef);

  // useEffect(() => {
  //   const collectionSize = querySnapshot.size;
  //   if (collectionSize > 1) {
  //     setF(querySnapshot.docs.map((doc) => doc.data()));
  //   }
  // }, []);

  // useEffect(() => {
  //   console.log(f);
  // }, [f]);

  // useEffect(() => {
  //   console.log(f);
  // }, [f]);

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
                  ))} 
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
                  */}
                {
                  files.map((file, index) => (
                    <div key={index}>
                      {index !== 0 ? (
                        file && <div className='file'>
                          <button onClick={() => handleFileClick(index)}>
                            {file.language === 'text' ? <i className="fas fa-file-alt"></i> : <i className={`fab fa-${file.icon}`}></i>}
                            {file.name}
                            {/* {index} */}
                            {/* {console.log("file name is called",file.name)} */}
                          </button>
                          <span onClick={() => handleFileDelete(file.name)}>
                            <i className="fa-solid fa-trash"></i>
                          </span>
                        </div>
                      )
                      :
                        file && <div className='file'>
                          <button onClick={() => handleFileClick(index)}>
                            {file.language === 'text' ? <i className="fas fa-file-alt"></i> : <i className={`fab fa-${file.icon}`}></i>}
                            {file.name}
                            {/* {index} */}
                            {/* {console.log("file name is called",file.name)} */}
                          </button>
                          <span>
                            <i className="fa-solid fa-trash"></i>
                          </span>
                        </div>
                      }
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        {props.details.isAdmin && !props.showBrowser &&
          <div className='ide_in_ide_container'>
            <div className='ide_border_top'>
              <div className='red'></div>
              <div className='yellow'></div>
              <div className='green'></div>
            </div>
            <Editor
              theme="vs-light"
              onMount={handleEditorDidMount}
              onChange={handleEditorChange}
              path={files[fileIndex].name}
              defaultLanguage={files[fileIndex].language}
              value={files[fileIndex].value}
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