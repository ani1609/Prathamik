import "./StreamZ.css";
import "./index.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    MeetingProvider,
    MeetingConsumer,
    useMeeting,
    useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken } from "./API";
import ReactPlayer from "react-player";
import Container from "./Container";
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

        if (user && user.data.profilePic !== null) {
        setDp(user.data.profilePic);
        }
        setName(user.data.name);
        console.log(name);
        setInitial(user ? user.data.name.charAt(0) : '');
    }, [user]);

    return (
        <div className="pview">
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
                        <h4>{name}</h4>
                        {dp?
                            (
                                <img
                                    src={`http://localhost:3000/uploads/${dp}`}
                                    alt=''
                                />
                            )
                            :
                            (
                                <p>
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

function Controls(props) {
    const { leave, toggleMic, toggleWebcam } = useMeeting();
    const [mic, setMic] = useState(true);
    const [video, setVideo] = useState(false);
    const [screenShare, setScreenShare] = useState(false);
    const handleMicClick = () =>
    {
        if (mic)
            setMic(false);
        else
            setMic(true);
    };

    const handleVideoClick = () =>
    {
        if (video)
            setVideo(false);
        else
            setVideo(true);
    };

    const handleScreenShareClick = () =>
    {
        if (screenShare)
            setScreenShare(false);
        else
            setScreenShare(true);
        props.setCoding(false);
        props.setWhiteboard(false);
    }

    const handleIdeClick = () =>
    {
        if (props.coding)
            props.setCoding(false);
        else
            props.setCoding(true);
        props.setWhiteboard(false);
        setScreenShare(false);
    };

    const handleWhitebardClick = () =>
    {
        if (props.whiteboard)
            props.setWhiteboard(false);
        else
            props.setWhiteboard(true);
        setScreenShare(false);
        props.setCoding(false);
    };


    return (
        <div className="video_control_buttons">
            {mic?
                <button onClick={() =>{ toggleMic(); handleMicClick();}} className="mic red_bg">
                    <i class="fa-solid fa-microphone"></i>
                </button>
                :
                <button onClick={() =>{ toggleMic(); handleMicClick();}} className="mic black_bg">
                    <i class="fa-solid fa-microphone-slash"></i>
                </button>
            }

            {video?
                <button onClick={() =>{ toggleWebcam(); handleVideoClick();}} className="video red_bg">
                    <i class="fa-solid fa-video"></i>
                </button>
                :
                <button onClick={() =>{ toggleWebcam(); handleVideoClick();}} className="video black_bg">
                    <i class="fa-solid fa-video-slash"></i>
                </button>
            }
            {/* <button onClick={() => props.handleEnableScreenShare()}>Enable Screen Share</button> */}
            {/* <button onClick={() => props.handleDisableScreenShare()}>Disable Screen Share</button> */}
            <button onClick={() => {props.handleToggleScreenShare(); handleScreenShareClick();}} className={screenShare?"screen_share red_bg":"screen_share black_bg"}>
                <i class="fa-solid fa-display"></i>
            </button>
            <button onClick={handleIdeClick} className={props.coding?"coding red_bg":"coding black_bg"}>
                <i class="fa-solid fa-code"></i>
            </button>
            <button onClick={handleWhitebardClick} className={props.whiteboard?"coding red_bg":"coding black_bg"}>
                <i class="fa-solid fa-chalkboard"></i>
            </button>
            <button onClick={() => leave()} className="leave">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
        </div>
    );
}

function MeetingView(props) {
    const [coding, setCoding] = useState(false);
    const [whiteboard, setWhiteboard] = useState(false);
    const [joined, setJoined] = useState(null);
    const { enableScreenShare, disableScreenShare, toggleScreenShare } = useMeeting();

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

    return (
        <div className="stream-container">
            {/* <h3>Meeting Id: {props.meetingId}</h3> */}
            {joined && joined == "JOINED" ? (
                <div>
                    {[...participants.keys()].map((participantId) => (
                        <ParticipantView
                            participantId={participantId}
                            key={participantId}
                        />
                    ))}
                </div>
            ) : joined && joined == "JOINING" ? (
                <p>Joining the meeting...</p>
            ) : (
                <button onClick={joinMeeting}>Join</button>
            )}
            {presenterId && <PresenterView presenterId={presenterId} />}

            {coding && <div className="ide_in_stream">
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
                />
            </div>}
            {whiteboard && <div className="whiteboard_in_stream">
                <Container socket={props.socket} canvasRef={props.canvasRef} meetingId={props.meetingId} />
            </div>}
            <div>
                <Controls
                    handleEnableScreenShare={handleEnableScreenShare}
                    handleDisableScreenShare={handleDisableScreenShare}
                    handleToggleScreenShare={handleToggleScreenShare}
                    coding={coding}
                    setCoding={setCoding}
                    whiteboard={whiteboard}
                    setWhiteboard={setWhiteboard}
                />
            </div>
        </div>
    );
}

function StreamZ(props) {

    const onMeetingLeave = () => {
        props.setMeetingId(null);
    };

    const user=JSON.parse(localStorage.getItem('user'));
    const name=user.data.name;

    return authToken && props.meetingId && (
        <MeetingProvider
            config={{
                meetingId: props.meetingId,
                micEnabled: true,
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
            />
        </MeetingProvider>
    )
}

export default StreamZ;