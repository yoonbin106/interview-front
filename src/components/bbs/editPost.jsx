import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/bbs/createPost/module.css';

const EditPost = () => {
  const router = useRouter();
  const { id } = router.query; // useRouter를 통해 동적 파라미터 사용
  const [title, setTitle] = useState(''); // 제목 상태
  const [content, setContent] = useState(''); // 내용 상태
  const [fontSize, setFontSize] = useState(15);
  const [fontStyle, setFontStyle] = useState('normal');
  const [fontWeight, setFontWeight] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');
  const [textAlign, setTextAlign] = useState('left');

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`/bbs/${id}`);
          const data = await response.json();
          setTitle(data.title);
          setContent(data.content);
          // 필요시 fontSize, fontStyle, fontWeight, textDecoration, textAlign도 설정
        } catch (error) {
          console.error('Failed to fetch post:', error);
        }
      };

      fetchPost();
    }
  }, [id]);

  const handleFontSizeChange = (e) => setFontSize(e.target.value);
  const toggleFontStyle = () => setFontStyle(fontStyle === 'normal' ? 'italic' : 'normal');
  const toggleFontWeight = () => setFontWeight(fontWeight === 'normal' ? 'bold' : 'normal');
  const toggleTextDecoration = () => setTextDecoration(textDecoration === 'none' ? 'underline' : 'none');
  const handleTextAlign = (align) => setTextAlign(align);

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedPost = {
      title,
      content,
      fontSize,
      fontStyle,
      fontWeight,
      textDecoration,
      textAlign,
    };
    try {
      await fetch(`/bbs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });
      router.push(`/bbs/postView/${id}`); // 수정 후 해당 포스트 상세 페이지로 이동
    } catch (error) {
      console.error('수정 실패:', error);
    }
  };

  return (
    <div className={styles.createPostContainer}>
      <header className={styles.createPostHeader}>게시판 수정</header>
      <form className={styles.createPostForm} onSubmit={handleSave}>
        <button type="submit" className={styles.submitButton}>수정</button>
        <input
          type="text"
          className={styles.createPostTitle}
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* 글꼴 설정 부분 */}
        <div className={styles.fontSettings}>
          <label>
            글꼴 크기:
            <select value={fontSize} onChange={handleFontSizeChange}>
              {[...Array(30).keys()].map((i) => (
                <option key={i} value={i + 10}>
                  {i + 10}
                </option>
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
        <div className={styles.contentContainer}>
          <textarea
            className={styles.createPostContent}
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              fontSize: `${fontSize}px`,
              fontStyle: fontStyle,
              fontWeight: fontWeight,
              textDecoration: textDecoration,
              textAlign: textAlign,
            }}
          ></textarea>
          <span className={styles.contentSize}>0/2000</span>
        </div>
        <div className={styles.footerWrapper}>
          <div className={styles.createPostFooter}>
            <span className={styles.fileSize}>0/10MB</span>
          </div>
          <div className={styles.fileIn}>
            <input type="file" id="file" className={styles.fileInput} />
            <label htmlFor="file" className={styles.fileLabel}>첨부</label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPost;