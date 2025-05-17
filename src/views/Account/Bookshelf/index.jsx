import React, { useState } from 'react';
import './styles.scss';
import ReadingTab from './tab/ReadingTab';
import SavedTab from './tab/SavedTab';
import CreatedTab from './tab/CreatedTab';
import { useOutletContext } from 'react-router-dom';

const Bookshelf = () => {
    const { isReadOnly } = useOutletContext();

    const [activeTab, setActiveTab] = useState('reading');

    const renderTab = () => {
        switch (activeTab) {
            case 'reading':
                return <ReadingTab isReadOnly={isReadOnly} />;
            case 'bookmark':
                return <SavedTab isReadOnly={isReadOnly} />;
            case 'created':
                return <CreatedTab isReadOnly={isReadOnly} />;
            default:
                return null;
        }
    };

    return (
        <div className="bookshelf">
            <div className="bookshelf-tabs">
                <button
                    className={activeTab === 'reading' ? 'active' : ''}
                    onClick={() => setActiveTab('reading')}
                >
                    Reading
                </button>
                <button
                    className={activeTab === 'bookmark' ? 'active' : ''}
                    onClick={() => setActiveTab('bookmark')}
                >
                    Bookmark
                </button>
                <button
                    className={activeTab === 'created' ? 'active' : ''}
                    onClick={() => setActiveTab('created')}
                >
                    Created
                </button>
            </div>
            <div className="bookshelf-content">{renderTab()}</div>
        </div>
    );
};

export default Bookshelf;
