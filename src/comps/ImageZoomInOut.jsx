import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';

function ImageZoomInOut({ imageUrl }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => prevScale - 0.1);
  };

  useEffect(() => {
    const image = imageRef.current;
    let isDragging = false;
    let prevPosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      prevPosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPosition.x;
      const deltaY = e.clientY - prevPosition.y;
      prevPosition = { x: e.clientX, y: e.clientY };
      setPosition((position) => ({
        x: position.x + deltaX,
        y: position.y + deltaY,
      }));
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    image?.addEventListener("mousedown", handleMouseDown);
    image?.addEventListener("mousemove", handleMouseMove);
    image?.addEventListener("mouseup", handleMouseUp);

    return () => {
      image?.removeEventListener("mousedown", handleMouseDown);
      image?.removeEventListener("mousemove", handleMouseMove);
      image?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [imageRef, scale]);

 return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        border: "2px solid #000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="btn-container" style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={handleZoomIn} style={{ marginBottom: "5px" }}>
            <span className="material-symbols-outlined">+</span>
          </button>
          <button onClick={handleZoomOut}>
            <span className="material-symbols-outlined">-</span>
          </button>
        </div>
      </div>

      <img
        ref={imageRef}
        src={imageUrl}
        alt=""
        style={{
          width: "100%",
          height: "auto",
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          cursor: "move",
        }}
        draggable={false}
      />
    </div>
  );
}

ImageZoomInOut.propTypes = {
  imageUrl: PropTypes.string.isRequired,
};

export default ImageZoomInOut;
