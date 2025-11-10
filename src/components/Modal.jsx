import './Modal.css';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - полупрозрачный фон */}
      <div className="modal-overlay" onClick={onClose}></div>
      
      {/* Modal - само окно */}
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;
