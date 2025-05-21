import React from 'react';
import GachaCollection from "../Collection";
import Modal from '../Modal/index';

const CharacterSelectModal = ({ selectedCharacters, onSelect, onClose }) => {
    const isAlreadySelected = (charId) => selectedCharacters.some(c => c && c.id === charId);

    const handleCardClick = (char) => {
        if (isAlreadySelected(char.id) || char.skillExpired) return;
        onSelect(char);
    };

    return (
        <Modal>
            <h3>Chọn nhân vật đồng hành</h3>
            <button className="close-btn" onClick={onClose}>×</button>
            <GachaCollection
                mode="selection"
                onCardClick={handleCardClick}
                selectedIds={selectedCharacters.map(c => c?.id)}
            />
        </Modal>
    );
};

export default CharacterSelectModal;
