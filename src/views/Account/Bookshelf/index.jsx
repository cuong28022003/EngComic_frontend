import React, { useState } from 'react';
import './styles.scss';
import ReadingTab from './tab/ReadingTab';
import SavedTab from './tab/SavedTab';
import CreatedTab from './tab/CreatedTab';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const Bookshelf = () => {
    const { isReadOnly } = useOutletContext();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'reading';

    const [activeTab, setActiveTab] = useState(defaultTab);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`?tab=${tab}`);
    };

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
                    onClick={() => handleTabChange('reading')}
                >
                    Reading
                </button>
                <button
                    className={activeTab === 'bookmark' ? 'active' : ''}
                    onClick={() => handleTabChange('bookmark')}
                >
                    Bookmark
                </button>
                <button
                    className={activeTab === 'created' ? 'active' : ''}
                    onClick={() => handleTabChange('created')}
                >
                    Created
                </button>
            </div>
            <div className="bookshelf-content">{renderTab()}</div>
        </div>
    );
};

export default Bookshelf;
