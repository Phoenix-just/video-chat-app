import React, { useRef, useState } from 'react';
import './ResizableChat.css';

const MIN_WIDTH = 280;
const MIN_HEIGHT = 320;
const DEFAULT_WIDTH = 360;
const DEFAULT_HEIGHT = 500;

export default function ResizableChat() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const chatRef = useRef(null);
  const resizing = useRef({ x: 0, y: 0, w: 0, h: 0, dir: null });

  // Handle horizontal (left edge) resize
  const onMouseDownH = (e) => {
    resizing.current = { x: e.clientX, w: width, dir: 'h' };
    document.addEventListener('mousemove', onMouseMoveH);
    document.addEventListener('mouseup', onMouseUp);
  };
  const onMouseMoveH = (e) => {
    const dx = resizing.current.x - e.clientX;
    setWidth(Math.max(MIN_WIDTH, resizing.current.w + dx));
  };

  // Handle vertical (bottom edge) resize
  const onMouseDownV = (e) => {
    resizing.current = { y: e.clientY, h: height, dir: 'v' };
    document.addEventListener('mousemove', onMouseMoveV);
    document.addEventListener('mouseup', onMouseUp);
  };
  const onMouseMoveV = (e) => {
    const dy = e.clientY - resizing.current.y;
    setHeight(Math.max(MIN_HEIGHT, resizing.current.h + dy));
  };

  // Handle corner (bottom-left) resize
  const onMouseDownCorner = (e) => {
    resizing.current = { x: e.clientX, y: e.clientY, w: width, h: height, dir: 'corner' };
    document.addEventListener('mousemove', onMouseMoveCorner);
    document.addEventListener('mouseup', onMouseUp);
  };
  const onMouseMoveCorner = (e) => {
    const dx = resizing.current.x - e.clientX;
    const dy = e.clientY - resizing.current.y;
    setWidth(Math.max(MIN_WIDTH, resizing.current.w + dx));
    setHeight(Math.max(MIN_HEIGHT, resizing.current.h + dy));
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMoveH);
    document.removeEventListener('mousemove', onMouseMoveV);
    document.removeEventListener('mousemove', onMouseMoveCorner);
    document.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      className="resizable-chat"
      ref={chatRef}
      style={{ width, height }}
    >
      <div className="chat-header">Chats</div>
      <div className="chat-messages">
        {/* Example messages */}
        <div className="chat-message self">Hello!</div>
        <div className="chat-message">Hi there!</div>
        <div className="chat-message self">How are you?</div>
        <div className="chat-message">I'm good, thanks!</div>
      </div>
      <div className="chat-input-bar">
        <input className="chat-input" placeholder="Type something..." />
        <button className="chat-send">Send</button>
      </div>
      {/* Drag handles */}
      <div className="resize-handle-h" onMouseDown={onMouseDownH} />
      <div className="resize-handle-v" onMouseDown={onMouseDownV} />
      <div className="resize-handle-corner" onMouseDown={onMouseDownCorner} />
    </div>
  );
} 