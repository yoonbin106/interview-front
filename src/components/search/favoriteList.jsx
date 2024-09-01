import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useStores } from 'contexts/storeContext';

const FavoriteList = observer(() => {
    const { userStore } = useStores();
    const [likedCompanies, setLikedCompanies] = useState([]);
    const userEmail = userStore.email;

    useEffect(() => {
        // 찜한 회사 목록 가져오기
        axios.get(`http://localhost:8080/api/favorite/getFavorites`, { params: { email: userEmail } })
            .then(response => {
                setLikedCompanies(response.data.slice(0, 10)); // 최대 10개만 가져오기
            })
            .catch(error => console.error('Error fetching favorites:', error));
    }, [userEmail]);

    return (
        <div >
            <h4>찜 목록</h4>
            {likedCompanies.length > 0 ? (
                likedCompanies.map((company, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <strong>{company.companyName}</strong>
                        <p>{company.companyId}</p>
                    </div>
                ))
            ) : (
                <p>찜한 회사가 없습니다.</p>
            )}
        </div>
    );
});

export default FavoriteList;
