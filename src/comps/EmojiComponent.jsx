import React, { useState } from "react";

const EmojiComponent = () => {
    const [emoji, setEmoji] = useState("🤢");  // This is the default emoji

    const handleMouseEnter = () => {
        setEmoji("🤮");  // This is the emoji for U+1F922
    };

    const handleMouseLeave = () => {
        setEmoji("🤢");  // Change back to the default emoji when not hovering
    };

    return (
        <h1
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {emoji}
        </h1>
    );
};

export default EmojiComponent;