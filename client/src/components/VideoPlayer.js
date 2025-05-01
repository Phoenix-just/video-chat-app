import { useEffect, useRef, useState } from "react";

const VideoPlayer = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(false);

    const getLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            setLocalStream(stream);

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                await localVideoRef.current.play();
            }
        } catch (error) {
            console.error('Error accessing local media:', error);
        }
    };

    useEffect(() => {
        if (isVideoEnabled) {
            getLocalStream();
        } else {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                setLocalStream(null);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = null;
                }
            }
        }

        // Cleanup function
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                setLocalStream(null);
            }
        };
    }, [isVideoEnabled]);

    // Log the stream after state update
    useEffect(() => {
        if (localStream) {
            console.log('Local Stream:', localStream);
        }
    }, [localStream]);

    const handleToggleVideo = () => {
        setIsVideoEnabled(!isVideoEnabled);
    };

    return (
        <>
            <div>
                <h1>Local Video Player</h1>
                {isVideoEnabled && (
                    <video
                        id="localVideo"
                        width="640"
                        height="480"
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                    />
                )}
                <button onClick={handleToggleVideo}>
                    {isVideoEnabled ? "Disable Video" : "Enable Video"}
                </button>
            </div>
            <div>
            <h1>Remote Video Player</h1>
            <video
                        id="remoteView"
                        width="640"
                        height="480"
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        muted
                    />
            </div>
        </>
    );
};

export default VideoPlayer;
