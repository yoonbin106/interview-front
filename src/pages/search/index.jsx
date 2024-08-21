import React, { useState, useEffect, useRef } from 'react';

import styles from '@/styles/search/result.module.css';
import Filter from '@/components/search/filter';
import UserLocationMap from '@/components/search/userLocationMap';
import LoadingSpinner from '@/components/search/loadingSpinner';
import CompanyList from '@/components/search/companyList';
import MapSearchButton from '@/components/search/mapSearchButton';
import EconomicNews from '@/components/search/economicNews'; // 경제 뉴스 컴포넌트 임포트
import { fetchCorpInfo } from '@/api/searchCorpApi';

function Search() {
    const [pageNo, setPageNo] = useState('1');
    const [numOfRows, setNumOfRows] = useState('200');
    const [resultType, setResultType] = useState('json');
    const [crno, setCrno] = useState('');
    const [corpNm, setCorpNm] = useState('');
    const [corpInfo, setCorpInfo] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [mapFilteredCompanies, setMapFilteredCompanies] = useState([]);
    const [userLocation, setUserLocation] = useState({ lat: 37.5665, lng: 126.9780 });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // 기본 로딩 상태를 true로 설정
    const [mapBounds, setMapBounds] = useState(null);
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isMapSearch, setIsMapSearch] = useState(false);
    const [newsLoading, setNewsLoading] = useState(true); // 뉴스 로딩 상태 추가
    const searchInputRef = useRef(null);
    const mapRef = useRef(null);
    const [filters, setFilters] = useState({});
    const [noResults, setNoResults] = useState(false);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    
    

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        }

       
        

        const fetchNews = async () => {
            try {
                const response = await fetch('/api/economicNews'); // API 호출
                const data = await response.json();
                setFilteredCompanies(data); // 뉴스 상태 업데이트
            } catch (error) {
                console.error('Error fetching economic news:', error);
            } finally {
                setNewsLoading(false); // 데이터 로드 완료 후 로딩 상태 해제
            }
        };

        fetchNews(); // 컴포넌트 마운트 시 뉴스 가져오기

        setLoading(false); // 기존 데이터 로드 완료 후 로딩 상태 해제
    }, []);

    const handleFetchCorpInfo = async (useMapBounds) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                pageNo,
                numOfRows,
                resultType,
                ...filters,
            });

            if (crno) params.append('crno', crno);
            if (corpNm) params.append('corpNm', corpNm);
            console.log('corpNm:', corpNm);

            if (useMapBounds && mapBounds) {
                const sw = mapBounds.getSouthWest();
                const ne = mapBounds.getNorthEast();
                params.append('minLat', sw.getLat());
                params.append('minLng', sw.getLng());
                params.append('maxLat', ne.getLat());
                params.append('maxLng', ne.getLng());
            }

            console.log('Fetching Corp Info with params:', params.toString());
            const uniqueCorpInfo = await fetchCorpInfo(params);
            console.log('API 응답 데이터:', uniqueCorpInfo);

            const filtered = uniqueCorpInfo.filter(company => {
                if (useMapBounds && mapBounds) {
                    const coords = new window.kakao.maps.LatLng(company.latitude, company.longitude);
                    const isWithinBounds = mapBounds.contain(coords);
                    console.log(`Company ${company.corpNm} is within bounds: ${isWithinBounds}`);
                    return isWithinBounds;
                }
                return true;
            });

            console.log('Filtered companies:', filtered);

            setCorpInfo(uniqueCorpInfo);
            if (useMapBounds) {
                setMapFilteredCompanies(filtered);
            } else {
                setFilteredCompanies(filtered);
            }
            setError(null);
            setNoResults(filtered.length === 0);  // 결과가 0건일 때 상태 업데이트
        } catch (error) {
            console.error('API 요청 오류:', error);
            setError(error.message);
            setCorpInfo([]);
            if (useMapBounds) {
                setMapFilteredCompanies([]);
            } else {
                setFilteredCompanies([]);
            }
            setNoResults(true);  // 오류가 발생해도 결과가 0건으로 처리
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        console.log('기존검색버튼');
        console.log("Search Triggered");
        setSearchTriggered(true);
        setIsMapSearch(false);
        console.log('searchTriggered after handleSearch:', searchTriggered);
        console.log('isMapSearch after handleSearch:', isMapSearch);
       
        handleFetchCorpInfo(false);
        
    };

    const handleMapSearch = () => {
        console.log('화면내검색버튼');
        console.log("Map Search Triggered");
        setIsMapSearch(true);
        console.log('searchTriggered after handleMapSearch:', searchTriggered);
        console.log('isMapSearch after handleMapSearch:', isMapSearch);
        handleFetchCorpInfo(true);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const setSearchInputFocus = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
    };

    const handleMarkerClick = (company) => {
        console.log(`Marker icon clicked: ${company.corpNm}`);
        setSelectedCompany(company);
        document.getElementById(company.corpNm).scrollIntoView({ behavior: 'smooth' });
    };
    console.log('searchTriggered:', searchTriggered);
    console.log('isMapSearch:', isMapSearch);
    console.log('filteredCompanies:', filteredCompanies);
    console.log('mapFilteredCompanies:', mapFilteredCompanies);

    return (
        <div className='app'>
            <div style={{ display: 'flex', height: '100vh' }} onKeyPress={handleKeyPress}>
                {(loading || newsLoading) && <LoadingSpinner />} {/* 로딩 상태 표시 */}
                    {noResults && (
                    <div className={styles['no-results-popup']}>
                        검색된 결과가 없습니다.
                    </div>
                )}




                <div style={{ width: '30%', padding: '10px', boxSizing: 'border-box' }}>
                    
                    <Filter 
                        onFilterChange={handleFilterChange} 
                        handleSearch={handleSearch} 
                        setSearchInputFocus={setSearchInputFocus}
                        searchInputRef={searchInputRef}
                        setCorpNm={setCorpNm}
                        setSearchTriggered={setSearchTriggered}
                    />
    
                   {/* 검색 결과가 없고, 검색이 트리거되지 않았을 때 또는 검색 결과가 0건일 때 뉴스 표시 */}
                   {(!searchTriggered && !isMapSearch && !loading && !newsLoading) || noResults ? (
                        <EconomicNews />
                    ) : null}
                    
                    {/* 검색 결과가 있을 때만 결과 표시 */}
                    {searchTriggered && (
                        <div className={`${styles['result-container']} ${styles['visible']}`}>
                            {!isMapSearch && (
                                <>
                                    <p>검색 결과: {filteredCompanies.length}건</p>
                                    <CompanyList 
                                        companies={filteredCompanies} 
                                        onCompanyClick={handleCompanyClick} 
                                        onMarkerClick={handleMarkerClick} 
                                    />
                                </>
                            )}
                            {isMapSearch && (
                                <>
                                    <p>검색 결과: {mapFilteredCompanies.length}건</p>
                                    <CompanyList 
                                        companies={mapFilteredCompanies} 
                                        onCompanyClick={handleCompanyClick} 
                                        onMarkerClick={handleMarkerClick} 
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div style={{ width: '70%', position: 'relative' }}>
                    <UserLocationMap 
                        companies={corpInfo} 
                        setMapBounds={setMapBounds} 
                        searchTriggered={searchTriggered} 
                        setFilteredCompanies={setFilteredCompanies} 
                        setLoading={setLoading}
                        selectedCompany={selectedCompany}
                        mapRef={mapRef}
                    />
                    {searchTriggered && <MapSearchButton onClick={handleMapSearch} />}
                </div>
            </div>
        </div>
    );
    
    
}

export default Search;
