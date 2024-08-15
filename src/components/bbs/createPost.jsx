import React, { useState } from 'react';
import axios from 'axios';
import '@/styles/bbs/createPost.module.css';
import { useRouter } from 'next/router';

const CreatePost = () => {
    const [title, setTitle] = useState(''); // 제목 상태
    const [content, setContent] = useState(''); // 내용 상태
    const [fontSize, setFontSize] = useState(15);
    const [fontStyle, setFontStyle] = useState('normal');
    const [fontWeight, setFontWeight] = useState('normal');
    const [textDecoration, setTextDecoration] = useState('none');
    const [textAlign, setTextAlign] = useState('left');
    const router = useRouter();
    const handleFontSizeChange = (e) => setFontSize(e.target.value);
    const toggleFontStyle = () => setFontStyle(fontStyle === 'normal' ? 'italic' : 'normal');
    const toggleFontWeight = () => setFontWeight(fontWeight === 'normal' ? 'bold' : 'normal');
    const toggleTextDecoration = () => setTextDecoration(textDecoration === 'none' ? 'underline' : 'none');
    const handleTextAlign = (align) => setTextAlign(align);
    const [file, setFile] = useState(null);
    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('버튼 클릭');
        const formData = new FormData;
        formData.append('title', title);
        formData.append('content', content);
        if (file) {
            formData.append('file', file);
        }
        try {
            const response = await axios.post('http://localhost:8080/bbs/insert',formData);
            console.log('게시글 등록 성공:', response.data);
            // 폼 제출 후 처리 (예: 폼 초기화, 성공 메시지 표시 등)
            router.push('/bbs/bbsPage');
        } catch (error) {
            console.error('게시글 등록 실패:', error);
        }
    };
    return (
        <div className="create-post-container">
            <header className="create-post-header">게시판 글쓰기</header>
            <form className="create-post-form" onSubmit={handleSubmit}>
            <button type="submit" className="submit-button" >글 등록</button>
                <input type="text" className="create-post-title" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)}/>
                {/* 글꼴 설정 부분 */}
                <div className="font-settings">
                    <label>
                        글꼴 크기:
                        <select value={fontSize} onChange={handleFontSizeChange}>
                            {[...Array(30).keys()].map(i => (
                                <option key={i} value={i+10}>{i+10}</option>
                            ))}
                        </select>
                    </label>
                    <button type="button" onClick={toggleFontWeight}><b>B</b></button>
                    <button type="button" onClick={toggleFontStyle}><i>I</i></button>
                    <button type="button" onClick={toggleTextDecoration}><u>U</u></button>
                    <button type="button" onClick={() => handleTextAlign('left')} title="왼쪽 정렬">&larr;</button>
                    <button type="button" onClick={() => handleTextAlign('center')} title="가운데 정렬">C</button>
                    <button type="button" onClick={() => handleTextAlign('right')} title="오른쪽 정렬">&rarr;</button>
                    <button type="button" onClick={() => handleTextAlign('justify')} title="양쪽 정렬">J</button>
                </div>
                <div className="content-container">
                    <textarea className="create-post-content" placeholder="내용을 입력하세요" value={content}  onChange={(e) => setContent(e.target.value)}
                         style={{
                            fontSize: `${fontSize}px`, 
                            fontStyle: fontStyle, 
                            fontWeight: fontWeight, 
                            textDecoration: textDecoration,
                            textAlign: textAlign
                        }}
                    ></textarea>
                    <span className="content-size">0/2000</span>
                </div>
                <div className="footer-wrapper">
                    <div className="create-post-footer">
                        <span className="file-size">0/10MB</span>
                    </div>
                    <div className="file-in">
                        <input type="file" id="file" className="file-input" onChange={handleFileChange}/>
                        <label htmlFor="file" className="file-label">첨부</label>
                    </div>
                </div>
            </form>
            
        </div>
    );
};

export default CreatePost;
