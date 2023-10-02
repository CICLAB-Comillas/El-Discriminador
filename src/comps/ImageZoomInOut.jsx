import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

function ImageZoomInOut({ imageUrl }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const zoomFactor = 0.005;

  const handleZoom = (e) => {
    // Reverse the scroll direction by multiplying e.deltaY by -1
    const newScale = scale + e.deltaY * -zoomFactor;

    // Ensure that the scale stays within a certain range (e.g., between 0.5 and 3)
    const minScale = 0.5;
    const maxScale = 3;
    const clampedScale = Math.min(Math.max(newScale, minScale), maxScale);

    setScale(clampedScale);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
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
      const deltaX = (e.clientX - prevPosition.x) / scale; // Divide by scale to reduce sensitivity
      const deltaY = (e.clientY - prevPosition.y) / scale; // Divide by scale to reduce sensitivity
      prevPosition = { x: e.clientX, y: e.clientY };
      setPosition((position) => ({
        x: position.x + deltaX,
        y: position.y + deltaY,
      }));
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseLeave = () => {
      isDragging = false;
    };

    image?.addEventListener("mousedown", handleMouseDown);
    image?.addEventListener("mousemove", handleMouseMove);
    image?.addEventListener("mouseup", handleMouseUp);
    image?.addEventListener("mouseleave", handleMouseLeave);

    // Remove the event listeners when the component unmounts
    return () => {
      image?.removeEventListener("mousedown", handleMouseDown);
      image?.removeEventListener("mousemove", handleMouseMove);
      image?.removeEventListener("mouseup", handleMouseUp);
      image?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [imageRef, scale]);

  // Prevent the default behavior of the scroll event to prevent page scrolling
  const preventDefaultScroll = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const image = imageRef.current;

    const handleMouseEnter = () => {
      if (scale !== 1) {
        window.addEventListener("mousewheel", preventDefaultScroll, { passive: false });
        window.addEventListener("DOMMouseScroll", preventDefaultScroll, { passive: false });
      }
    };

    const handleMouseLeave = () => {
      window.removeEventListener("mousewheel", preventDefaultScroll);
      window.removeEventListener("DOMMouseScroll", preventDefaultScroll);
    };

    image?.addEventListener("mouseenter", handleMouseEnter);
    image?.addEventListener("mouseleave", handleMouseLeave);

    // Remove the event listeners when the component unmounts
    return () => {
      image?.removeEventListener("mouseenter", handleMouseEnter);
      image?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [scale]);

  return (
    <div
      onWheel={handleZoom}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        border: "2px solid #000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <button
        onClick={resetZoom}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1,
        }}
      >
        Reset Zoom
      </button>
      <img
        ref={imageRef}
        src={imageUrl}
        alt=""
        style={{
          width: "100%",
          height: "auto",
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          cursor: scale !== 1 ? "move" : "default", // Change cursor style based on zoom
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
