import "./StreamZ.css";
import "./index.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MeetingProvider,
    MeetingConsumer,
    useMeeting,
    useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken } from "./API";
import ReactPlayer from "react-player";
import Container from "./Container";
import CaptioningSystem from "./CaptioningSystem";
import IDE from "./IDE";
const PresenterView = ({ presenterId }) => {
    const { screenShareAudioStream, isLocal, screenShareStream, screenShareOn } =
        useParticipant(presenterId);

    const mediaStream = useMemo(() => {
        if (screenShareOn && screenShareStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(screenShareStream.track);
            return mediaStream;
        }
    }, [screenShareStream, screenShareOn]);

    const audioPlayer = useRef();

    useEffect(() => {
        if (
            !isLocal &&
            audioPlayer.current &&
            screenShareOn &&
            screenShareAudioStream
        ) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(screenShareAudioStream.track);

            audioPlayer.current.srcObject = mediaStream;
            audioPlayer.current.play().catch((err) => {
                if (
                    err.message ===
                    "play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD"
                ) {
                    console.error("audio" + err.message);
                }
            });
        } else {
            audioPlayer.current.srcObject = null;
        }
    }, [screenShareAudioStream, screenShareOn, isLocal]);

    return (
        <>
            <ReactPlayer
                playsinline
                playIcon={<></>}
                pip={false}
                light={false}
                controls={false}
                muted={true}
                playing={true}
                url={mediaStream}
                height={"100%"}
                width={"100%"}
                onError={(err) => {
                    console.log(err, "presenter video error");
                }}
            />
            <audio autoPlay playsInline controls={false} ref={audioPlayer} />
        </>
    );
};

function ParticipantView(props) {
    const micRef = useRef(null);
    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
        useParticipant(props.participantId, { onStreamEnabled, onStreamDisabled });

    function onStreamEnabled(stream) {
        if (stream.kind === 'share') {
            console.log("Share Stream On: onStreamEnabled", stream);
        }
    }

    function onStreamDisabled(stream) {
        if (stream.kind === 'share') {
            console.log("Share Stream Off: onStreamDisabled", stream);
        }
    }

    const videoStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);

    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current
                    .play()
                    .catch((error) =>
                        console.error("videoElem.current.play() failed", error)
                    );
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    const user = JSON.parse(localStorage.getItem('user'));
    const [dp, setDp] = useState('');
    const [initial, setInitial] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        if (props.adminDetails && props.adminDetails.profilePic !== null) {
            setDp(props.adminDetails.profilePic);
            setName(props.adminDetails.name);
        }
        setInitial(user ? user.data.name.charAt(0) : '');
    }, [user]);

    if (props.ide || props.screenShare || props.whiteboard) {
        return (
            <div className={webcamOn ? "smallPview z-index" : "smallPview"}>
                {/* <p>
                    Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
                    {micOn ? "ON" : "OFF"}
                </p> */}
                <audio ref={micRef} autoPlay playsInline muted={isLocal} />
                {webcamOn ?
                    (
                        <ReactPlayer
                            playsinline
                            pip={false}
                            light={false}
                            controls={false}
                            muted={true}
                            playing={true}
                            url={videoStream}
                            onError={(err) => {
                                console.log(err, "participant video error");
                            }}
                            className="videoCam"
                        />
                    )
                    :
                    (
                        <div className="noVideoCam">
                            <h4 className="smallName">{name}</h4>
                            {dp ?
                                (
                                    <img
                                        src={`http://localhost:3000/uploads/${dp}`}
                                        alt=''
                                        className="smallDp"
                                    />
                                )
                                :
                                (
                                    <p className="smallInitial">
                                        {initial}
                                    </p>
                                )
                            }
                        </div>
                    )

                }
            </div>
        );
    }
    else {
        return (
            <div className={webcamOn ? "pview z-index" : "pview"}>
                {/* <p>
                    Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
                    {micOn ? "ON" : "OFF"}
                </p> */}
                <audio ref={micRef} autoPlay playsInline muted={isLocal} />
                {webcamOn ?
                    (
                        <ReactPlayer
                            playsinline
                            pip={false}
                            light={false}
                            controls={false}
                            muted={true}
                            playing={true}
                            url={videoStream}
                            onError={(err) => {
                                console.log(err, "participant video error");
                            }}
                            className="videoCam"
                        />
                    )
                    :
                    (
                        <div className="noVideoCam">
                            <h4 className="bigName">{name}</h4>
                            {dp ?
                                (
                                    <img
                                        src={`http://localhost:3000/uploads/${dp}`}
                                        alt=''
                                        className="bigDp"
                                    />
                                )
                                :
                                (
                                    <p className="bigInitial">
                                        {initial}
                                    </p>
                                )
                            }
                        </div>
                    )

                }
            </div>
        );
    }
}

function Controls(props) {
    const { leave, toggleMic, toggleWebcam } = useMeeting();
    const [video, setVideo] = useState(false);
    const navigate = useNavigate();
    const handleMicClick = () => {
        if (props.mic)
            props.setMic(false);
        else
            props.setMic(true);
    };

    const handleVideoClick = () => {
        if (video) {
            setVideo(false);
        }
        else {
            setVideo(true);
        }
    };

    const handleIdeClick = () => {
        if (props.ide) {
            props.setIde(false);
            props.setRunButtonShow(false);
            props.socket.emit('ide-show', { value: false, roomid: props.meetingId });
        }
        else {
            props.setIde(true);
            props.setRunButtonShow(true);
            props.socket.emit('ide-show', { value: true, roomid: props.meetingId });
        }
        props.setWhiteboard(false);
        props.setShow('stream');
        props.socket.emit('wb-show', { value: false, roomid: props.meetingId });
        props.setScreenShare(false);
        props.socket.emit('screen-show', { value: false, roomid: props.meetingId });

    };

    const handleScreenShareClick = () => {
        if (props.screenShare) {
            props.setScreenShare(false);
            props.socket.emit('screen-show', { value: false, roomid: props.meetingId });
        }
        else {
            props.setScreenShare(true);
            props.socket.emit('screen-show', { value: true, roomid: props.meetingId });
        }
        props.setRunButtonShow(false);
        props.setIde(false);
        props.socket.emit('ide-show', { value: false, roomid: props.meetingId });
        props.setWhiteboard(false);
        props.setShow('stream');
        props.socket.emit('wb-show', { value: false, roomid: props.meetingId });

    }

    const handleWhiteboardClick = () => {
        if (props.whiteboard) {
            props.setWhiteboard(false);
            props.socket.emit('wb-show', { value: false, roomid: props.meetingId });
            props.setShow('stream')
        }
        else {
            props.setWhiteboard(true);
            props.socket.emit('wb-show', { value: true, roomid: props.meetingId });
            props.setShow('board')
        }
        props.setRunButtonShow(false);
        props.setScreenShare(false);
        props.socket.emit('screen-show', { value: false, roomid: props.meetingId });
        props.setIde(false);
        props.socket.emit('ide-show', { value: false, roomid: props.meetingId });

    };

    return (
        <div className="video_control_buttons">
            {props.mic ?
                <button onClick={() => { toggleMic(); handleMicClick(); }} className="mic red_bg">
                    <i class="fa-solid fa-microphone"></i>
                </button>
                :
                <button onClick={() => { toggleMic(); handleMicClick(); }} className="mic black_bg">
                    <i class="fa-solid fa-microphone-slash"></i>
                </button>
            }

            {video ?
                <button onClick={() => { toggleWebcam(); handleVideoClick(); }} className="video red_bg">
                    <i class="fa-solid fa-video"></i>
                </button>
                :
                <button onClick={() => { toggleWebcam(); handleVideoClick(); }} className="video black_bg">
                    <i class="fa-solid fa-video-slash"></i>
                </button>
            }
            {/* <button onClick={() => props.handleEnableScreenShare()}>Enable Screen Share</button> */}
            {/* <button onClick={() => props.handleDisableScreenShare()}>Disable Screen Share</button> */}
            <button onClick={() => { props.handleToggleScreenShare(); handleScreenShareClick(); }} className={props.screenShare ? "screen_share red_bg" : "screen_share black_bg"}>
                <i class="fa-solid fa-display"></i>
            </button>
            <button onClick={handleIdeClick} className={props.ide ? "coding red_bg" : "coding black_bg"}>
                <i class="fa-solid fa-code"></i>
            </button>
            <button onClick={handleWhiteboardClick} className={props.whiteboard ? "coding red_bg" : "coding black_bg"}>
                <i class="fa-solid fa-chalkboard"></i>
            </button>
            <button onClick={() => { leave(); navigate('/'); }} className="leave">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
        </div>
    );
}

function MeetingView(props) {
    const [ide, setIde] = useState(false);
    const [screenShare, setScreenShare] = useState(false);
    const [whiteboard, setWhiteboard] = useState(false);
    const [minimizeFaceCam, setMinimizeFaceCam] = useState(false);
    const [mic, setMic] = useState(false);
    const [joined, setJoined] = useState(null);
    const { enableScreenShare, disableScreenShare, toggleScreenShare } = useMeeting();

    useEffect(() => {
        props.socket.on('ide-show', (data) => {
            setIde(data);
        });

        return () => {
            props.socket.off('ide-show');
        }
    }, [props.socket]);

    useEffect(() => {
        props.socket.on('screen-show', (data) => {
            setScreenShare(data);
        });

        return () => {
            props.socket.off('screen-show');
        }
    }, [props.socket]);

    useEffect(() => {
        props.socket.on('wb-show', (data) => {
            setWhiteboard(data);
        });

        return () => {
            props.socket.off('wb-show');
        }
    }, [props.socket]);

    const handleEnableScreenShare = () => {
        enableScreenShare();
    }

    const handleDisableScreenShare = () => {
        disableScreenShare();
    }

    const handleToggleScreenShare = () => {
        toggleScreenShare();
    }

    function onPresenterChanged(presenterId) {
        if (presenterId) {
            console.log(presenterId, "started screen share");
        } else {
            console.log("someone stopped screen share");
        }
    }

    const { join, participants } = useMeeting({
        onMeetingJoined: () => {
            setJoined("JOINED");
        },
        onPresenterChanged,
        onMeetingLeft: () => {
            props.onMeetingLeave();
        },
    });

    const joinMeeting = () => {
        setJoined("JOINING");
        join();
    };

    useEffect(() => {
        setTimeout(() => {
            joinMeeting();
        }, 1000);
    }, []);

    const { presenterId } = useMeeting();

    const user = JSON.parse(localStorage.getItem('user'));
    const email = user.data.email;
    const [showMeetingCard, setShowMeetingCard] = useState(true);
    const handleMeetingCardClick = () => {
        setShowMeetingCard(false);
    }

    const [isCopied, setIsCopied] = useState(false);
    const copyMeetingId = () => {
        const meetingId = props.meetingId;
        navigator.clipboard.writeText(meetingId)
            .then(() => {
                console.log('Meeting ID copied!');
            })
            .catch((error) => {
                console.error('Failed to copy meeting ID:', error);
            });
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1500);
    };

    return (
        <div className="stream-container">
            {/* <h3>Meeting Id: {props.meetingId}</h3> */}
            {joined && joined == "JOINED" ? (
                <div className="allContainer">
                    {[...participants.keys()].map((participantId, index) => {

                        return (
                            <ParticipantView
                                participantId={participantId}
                                key={participantId}
                                adminDetails={props.adminDetails}
                                details={props.details}
                                ide={ide}
                                screenShare={screenShare}
                                whiteboard={whiteboard}
                            />
                        );
                    })}

                    {showMeetingCard && <div className="meetingCard">
                        <p className="meetingCardHeading">
                            Your meeting's ready
                            <span onClick={handleMeetingCardClick}><i class="fa-solid fa-xmark"></i></span>
                        </p>
                        <p className="meetingCardSubHeading">Share this meeting link with others that you want in the meeting</p>
                        <p className="meetingId">
                            {props.meetingId}
                            <span onClick={copyMeetingId}><i class="fa-regular fa-clipboard"></i></span>
                            {isCopied && <div>Copied</div>}
                        </p>
                        <p className="meetingParticipantEmail">Joined as {email}</p>
                    </div>}

                    {whiteboard && <div className="whiteboard_in_stream">
                        <Container socket={props.socket} canvasRef={props.canvasRef} meetingId={props.meetingId} />
                    </div>}
                    {screenShare && <div className="screen_share_in_stream">
                        {presenterId && <PresenterView presenterId={presenterId} />}
                    </div>}
                    {ide && <div className="ide_in_stream">
                        <IDE
                            socket={props.socket}
                            setCurrentLanguage={props.setCurrentLanguage}
                            input={props.inputX}
                            setInput={props.setInputX}
                            output={props.output}
                            code={props.code}
                            setCode={props.setCode}
                            setShow={props.setShow}
                            meetingId={props.meetingId}
                            details={props.details}
                            showBrowser={props.showBrowser}
                            setShowBrowser={props.setShowBrowser}
                        />
                    </div>}

                </div>
            ) : joined && joined == "JOINING" ? (
                <p>Joining the meeting...</p>
            ) : (
                <button onClick={joinMeeting}>Join</button>
            )}
            {/* {presenterId && <PresenterView presenterId={presenterId} />}

            {ide && <div className="ide_in_stream">
                <IDE
                    socket={props.socket}
                    setCurrentLanguage={props.setCurrentLanguage}
                    input={props.inputX}
                    setInput={props.setInputX}
                    output={props.output}
                    code={props.code}
                    setCode={props.setCode}
                    setShow={props.setShow}
                    meetingId={props.meetingId}
                    details={props.details}
                />
            </div>}
            {whiteboard && <div className="whiteboard_in_stream">
                <Container socket={props.socket} canvasRef={props.canvasRef} meetingId={props.meetingId} />
            </div>} */}
            {props.details.isAdmin && <div>
                <Controls
                    handleEnableScreenShare={handleEnableScreenShare}
                    handleDisableScreenShare={handleDisableScreenShare}
                    handleToggleScreenShare={handleToggleScreenShare}
                    ide={ide}
                    setIde={setIde}
                    screenShare={screenShare}
                    setScreenShare={setScreenShare}
                    whiteboard={whiteboard}
                    setWhiteboard={setWhiteboard}
                    minimizeFaceCam={minimizeFaceCam}
                    setMinimizeFaceCam={setMinimizeFaceCam}
                    socket={props.socket}
                    meetingId={props.meetingId}
                    runButtonShow={props.runButtonShow}
                    setRunButtonShow={props.setRunButtonShow}
                    setShow={props.setShow}
                    mic={mic}
                    setMic={setMic}
                />
                {mic && <CaptioningSystem/>}
            </div>}
        </div>
    );
}

function StreamZ(props) {

    const onMeetingLeave = () => {
        props.setMeetingId(null);
    };

    const user = JSON.parse(localStorage.getItem('user'));
    const name = user.data.name;

    return authToken && props.meetingId && (
        <MeetingProvider
            config={{
                meetingId: props.meetingId,
                micEnabled: false,
                webcamEnabled: false,
                name: name,
            }}
            token={authToken}
        >
            <MeetingView
                socket={props.socket}
                meetingId={props.meetingId}
                onMeetingLeave={onMeetingLeave}
                canvasRef={props.canvasRef}
                setCurrentLanguage={props.setCurrentLanguage}
                inputX={props.inputX}
                setInputX={props.setInputX}
                output={props.output}
                code={props.code}
                setCode={props.setCode}
                setShow={props.setShow}
                adminDetails={props.adminDetails}
                details={props.details}
                runButtonShow={props.runButtonShow}
                setRunButtonShow={props.setRunButtonShow}
                showBrowser={props.showBrowser}
                setShowBrowser={props.setShowBrowser}
            />
        </MeetingProvider>
    )
}

export default StreamZ;