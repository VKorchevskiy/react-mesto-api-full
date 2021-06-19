import React from 'react';

function InfoTooltip({ isOpen, onClose, isSuccess, infoText }) {
  return (
    <div className={`popup ${isOpen ? 'popup_active' : ''}`}>
      <div className="popup__container popup__container_request">
        {isSuccess
          ? <div className="popup__graphic-info popup__graphic-info_type_success" />
          : <div className="popup__graphic-info popup__graphic-info_type_error" />
        }
        <h2 className="popup__title popup__title_type_info-tooltip">{infoText}</h2>
        <button className="button popup__close popup__close_type_info-tooltip" type="button" aria-label="Закрыть" onClick={onClose}></button>
      </div>
    </div>
  )
}

export default InfoTooltip;
