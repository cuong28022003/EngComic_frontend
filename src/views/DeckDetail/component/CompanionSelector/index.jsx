import React, { useState } from 'react';
import GachaCollection from '../../../../components/Collection';
import './styles.scss';
import Modal from '../../../../components/Modal/index.jsx';
import GachaCard from '../../../../components/GachaCard/index.jsx';

const CompanionSelector = ({ selectedCharacters, onChange }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = (index) => {
        setSelectedSlot(index);
        setModalOpen(true);
    };

    const handleSelectCharacter = (char) => {
        const newCharacters = [...selectedCharacters];
        newCharacters[selectedSlot] = char;
        onChange(newCharacters);
        setModalOpen(false);
    };

    const handleRemove = (index) => {
        const newCharacters = [...selectedCharacters];
        newCharacters[index] = null;
        onChange(newCharacters);
    };

    return (
        <div className="companion-selector">
            <h3>Chọn 3 đồng hành</h3>
            <div className="slots">
                {Array.from({ length: 3 }).map((_, index) => {
                    const selected = selectedCharacters[index];
                    return (
                        <div
                            key={index}
                            className={`slot ${selected ? 'selected-card' : 'empty'}`}
                            onClick={() => !selected && handleOpenModal(index)}
                            onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
                            onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
                        >
                            {selected ? (
                                <>  
                                    <GachaCard character={selected} />
                                    <div className="actions">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(index); }}>Đổi thẻ</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleRemove(index); }}>Gỡ thẻ</button>
                                    </div>
                                </>
                            ) : (
                                <div className="placeholder">Chọn thẻ</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {modalOpen && (
                <Modal>
                    <h4>Chọn đồng hành</h4>
                    <GachaCollection
                        mode="selection"
                        selectedIds={selectedCharacters.map((c) => c?.id)}
                        onCardClick={(char) => {
                            handleSelectCharacter(char);
                        }}
                    />
                    <button className="close-btn" onClick={() => setModalOpen(false)}>Đóng</button>
                </Modal>
            )}
        </div>
    );
};

export default CompanionSelector;
