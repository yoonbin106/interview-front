import React, { useState, useEffect } from 'react';
import stylesFilter from '@/styles/search/filter.module.css';
import stylesSearch from '@/styles/search/search.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchBox from '@/components/search/searchBox';

const regions = {
    "서울": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
    "부산": ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
    "대구": ["남구", "달서구", "동구", "북구", "서구", "수성구", "중구", "달성군"],
    "인천": ["계양구", "미추홀구", "남동구", "동구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"],
    "광주": ["광산구", "남구", "동구", "북구", "서구"],
    "대전": ["동구", "중구", "서구", "유성구", "대덕구"],
    "울산": ["남구", "동구", "북구", "중구", "울주군"],
    "세종": [],
    "경기": ["가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "파주시", "평택시", "포천시", "하남시", "화성시"],
    "강원": ["강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"],
    "충북": ["괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시", "충주시"],
    "충남": ["계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"],
    "전북": ["고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"],
    "전남": ["강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
    "경북": ["경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시"],
    "경남": ["거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군"],
    "제주": ["서귀포시", "제주시"]
};

const sizes = ["미공개", "스타트업", "소기업", "중소기업", "대기업"];
const salaries = ["연봉협의", "연봉 3000만원이상 6000만원 미만", "연봉 6000만원이상 1억 미만", "연봉 1억이상"];

const Filter = ({ onFilterChange, handleSearch, setSearchInputFocus, searchInputRef, setCorpNm }) => {
    const [selectedCategory, setSelectedCategory] = useState('지역');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedDistricts, setSelectedDistricts] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedSalaries, setSelectedSalaries] = useState([]);

    useEffect(() => {
        handleFilterChange();
    }, [selectedRegion, selectedDistricts, selectedSizes, selectedSalaries]);

    const handleFilterChange = () => {
        const filterData = {
            selectedRegion,
            selectedDistricts,
            selectedSizes,
            selectedSalaries,
        };
        onFilterChange(filterData);
    };

    const handleCheckboxChange = (setter, value) => {
        setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
        // setSearchInputFocus();
    };

    const handleDistrictCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked && selectedDistricts.length >= 30) {
            return;
        }
        handleCheckboxChange(setSelectedDistricts, value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const renderContent = () => {
        switch (selectedCategory) {
            case '지역':
                return (
                    <div className={stylesFilter['filter-content']}>
                        {Object.keys(regions).map((region) => (
                            <div key={region} style={{ display: 'inline-block', marginRight: '10px' }}>
                                <input type="radio" value={region} checked={selectedRegion === region} onChange={() => {
                                    setSelectedRegion(region);
                                    setSelectedDistricts([]);
                                    // setSearchInputFocus();
                                }} />
                                <label>{region}</label>
                            </div>
                        ))}
                    </div>
                );
            case '규모':
                return (
                    <div className={stylesFilter['filter-content']}>
                        {sizes.map((size) => (
                            <div key={size} style={{ display: 'inline-block', marginRight: '10px' }}>
                                <input type="checkbox" value={size} checked={selectedSizes.includes(size)} onChange={() => handleCheckboxChange(setSelectedSizes, size)} />
                                <label>{size}</label>
                            </div>
                        ))}
                    </div>
                );
            case '연봉':
                return (
                    <div className={stylesFilter['filter-content']}>
                        {salaries.map((salary) => (
                            <div key={salary} style={{ display: 'inline-block', marginRight: '10px' }}>
                                <input type="checkbox" value={salary} checked={selectedSalaries.includes(salary)} onChange={() => handleCheckboxChange(setSelectedSalaries, salary)} />
                                <label>{salary}</label>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    const renderSubContent = () => {
        if (selectedCategory === '지역' && selectedRegion) {
            return (
                <div className={stylesFilter['sub-content']}>
                    <div className={stylesFilter['districts-container']}>
                        {regions[selectedRegion].map((district) => (
                            <div key={district} className={stylesFilter['district-item']}>
                                <input type="checkbox" value={district} checked={selectedDistricts.includes(district)} onChange={handleDistrictCheckboxChange} />
                                <label>{district}</label>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <SearchBox searchInputRef={searchInputRef} setCorpNm={setCorpNm} handleSearch={handleSearch}/>
            <div className={stylesFilter['filter-container']} onKeyPress={handleKeyPress}>
                <div className={stylesFilter['filter-categories']}>
                    {['지역', '규모', '연봉'].map((category) => (
                        <div
                            key={category}
                            className={`${stylesFilter['filter-category']} ${selectedCategory === category ? stylesFilter['active'] : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </div>
                    ))}
                </div>
                <div className={`${stylesFilter['filter-content-container']} ${stylesFilter['filter-scrollbar']} ${selectedCategory === '지역' ? stylesFilter['with-border'] : ''}`}>
                    {renderContent()}
                </div>
                {selectedCategory === '지역' && (
                    <div className={`${stylesFilter['sub-content-container']} ${stylesFilter['filter-scrollbar']}`}>
                        {renderSubContent()}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Filter;
