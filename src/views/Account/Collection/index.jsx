import React, { useState, useEffect } from 'react';
import './styles.scss';
import { getAllCharactersByUserId, getCharactersByUserId } from '../../../api/characterApi';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../redux/slice/auth';
import GachaCard from '../../../components/GachaCard';
import Pagination from '../../../components/Pagination/index';

const GachaCollection = () => {
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();
    
    const [allCharacters, setAllCharacters] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [rarityFilter, setRarityFilter] = useState(null);
    const [sortBy, setSortBy] = useState('obtainedAt');
    const [sortDirection, setSortDirection] = useState('desc');

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    console.log('searchTerm: ', searchTerm);
    console.log("totalPages: ", totalPages)

    const rarities = ['SSR', 'SR', 'R', 'C'];
    const rarityColors = {
        SSR: 'red',
        SR: 'gold',
        R: 'purple',
        C: 'blue'
    };

    useEffect(() => {
        const fetchAllCharacters = async () => {
            try { 
                const response = await getAllCharactersByUserId(user.id, user, dispatch, loginSuccess);
                const data = response.data;
                setAllCharacters(data);
            }
            catch (error) {
                console.error('Error fetching all characters:', error);
            }
        }

        fetchAllCharacters();
    },[user]);

    const fetchCharacters = async () => {
        const res = await getCharactersByUserId(user.id,
            { searchTerm, rarity: rarityFilter, sortBy, sortDirection, page: currentPage-1, size: 5 }
            , user, dispatch, loginSuccess);
        const data = res.data.content;
        setCharacters(data);
        setTotalPages(res.data.totalPages);
    };

    useEffect(() => {
        fetchCharacters();
    }, [searchTerm, rarityFilter, sortBy, sortDirection, currentPage]);

    const countByRarity = rarities.reduce((acc, rarity) => {
        acc[rarity] = allCharacters.filter(c => c.character.rarity === rarity).length;
        return acc;
    }, {});

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <div className="gacha-collection-page">
            <h2>Bộ sưu tập của bạn ({allCharacters.length} thẻ)</h2>

            <div className="control-bar">
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc bộ thẻ..."
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1); //reset page to 1
                    }}
                    className="search-bar"
                />

                <div className="filter-bar">
                    <button
                        className={`rarity-btn ${rarityFilter === null ? 'active all' : ''}`}
                        onClick={() => setRarityFilter(null)}
                    >
                        Tất cả ({allCharacters.length})
                    </button>
                    {rarities.map((rarity) => (
                        <button
                            key={rarity}
                            className={`rarity-btn ${rarityFilter === rarity ? 'active' : ''}`}
                            style={rarityFilter === rarity ? { backgroundColor: rarityColors[rarity] } : { borderColor: rarityColors[rarity] }}
                            onClick={() => {
                                setRarityFilter(rarityFilter === rarity ? null : rarity)
                                setCurrentPage(1); //reset page to 1
                            }}
                        >
                            {rarity} ({countByRarity[rarity] || 0})
                        </button>
                    ))}
                </div>

                <div className="sort-options">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="name">Tên</option>
                        <option value="obtainedAt">Ngày nhận</option>
                    </select>
                    <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
                        <option value="asc">↑</option>
                        <option value="desc">↓</option>
                    </select>
                </div>
            </div>

            <div className="card-grid">
                {characters.map((char, index) => (
                    <GachaCard key={index} pack={char.pack} character={char.character} />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default GachaCollection;
