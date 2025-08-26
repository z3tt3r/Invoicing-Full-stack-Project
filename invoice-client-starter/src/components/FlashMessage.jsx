import React from "react";

/**
 * A component for displaying a status message.
 * It uses Bootstrap classes for visual styling.
 *
 * @param {object} props
 * @param {string} props.theme Specifies the message theme (e.g., "success", "danger", "warning", "info").
 * @param {string} props.text The content of the message to be displayed.
 */
export function FlashMessage({ theme, text }) {
  return <div className={"alert alert-" + theme}>{text}</div>;
}

export default FlashMessage;
