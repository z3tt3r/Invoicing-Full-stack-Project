import React from 'react';
import { createPortal } from 'react-dom';

/**
 * Reusable component for a confirmation modal dialog.
 * It's displayed as an overlay over the rest of the page.
 *
 * @param {object} props
 * @param {boolean} props.show Indicates whether the modal should be displayed.
 * @param {string} props.title The title of the dialog.
 * @param {string|React.ReactNode} props.message The message in the body of the dialog.
 * @param {string} props.warning The warning message (optional).
 * @param {Function} props.onClose The function to be called when "Cancel" or the close button is clicked.
 * @param {Function} props.onConfirm The function to be called when "Delete" is clicked.
 */
const ConfirmationModal = ({ show, title, message, warning, onClose, onConfirm }) => {
    // If the modal is not visible, return null
    if (!show) {
        return null;
    }

    // For better accessibility and correct DOM behavior, we render the modal into a portal.
    return createPortal(
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {typeof message === 'string' ? <p>{message}</p> : message}
                        {warning && <div className="alert alert-warning mt-3">{warning}</div>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Zrušit</button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>Smazat</button>
                    </div>
                </div>
            </div>
        </div>,
        document.body // We insert the modal into the body to be on the top-level
    );
};

export default ConfirmationModal;