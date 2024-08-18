import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-bold">Erro</h2>
                <p className="text-sm mt-2">{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
};

export default Modal;
