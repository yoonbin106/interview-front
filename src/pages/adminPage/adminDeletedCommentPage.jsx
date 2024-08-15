/*adminDeletedCommentPage.jsx*/

import React from 'react';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import AdminDeletedCommentTable from '@/components/adminPage/adminDeletedCommentTable';


const deletedComments = [
    { id: 3021, board: '게시판1', content: '댓글댓글123', author: 'user789', date: '2023-08-10' },
    { id: 3022, board: '게시판1', content: '댓글댓글123', author: 'user654', date: '2023-08-09' },
    { id: 3023, board: '게시판3', content: '댓글댓글123', author: 'user123', date: '2023-08-08' },
    { id: 3024, board: '게시판54', content: '댓글댓글123', author: 'user456', date: '2023-08-07' },
    { id: 3025, board: '게시판1', content: '댓글댓글123', author: 'user987', date: '2023-08-06' },
    { id: 3026, board: '게시판2', content: '댓글댓글123', author: 'user321', date: '2023-08-05' },
    { id: 3027, board: '게시판45', content: '댓글댓글123', author: 'user123', date: '2023-08-04' },
    { id: 3028, board: '게시판65', content: '댓글댓글123', author: 'user654', date: '2023-08-03' },
    { id: 3029, board: '게시판112', content: '댓글댓글123', author: 'user456', date: '2023-08-02' },
    { id: 3030, board: '게시판45', content: '댓글댓글123', author: 'user789', date: '2023-08-01' },
    { id: 3031, board: '게시판56', content: '댓글댓글123', author: 'user987', date: '2023-07-31' },
    { id: 3032, board: '게시판2', content: '댓글댓글123', author: 'user321', date: '2023-07-30' },
    { id: 3033, board: '게시판3', content: '댓글댓글123', author: 'user123', date: '2023-07-29' },
    { id: 3034, board: '게시판4', content: '댓글댓글123', author: 'user654', date: '2023-07-28' },
    { id: 3035, board: '게시판6', content: '댓글댓글123', author: 'user456', date: '2023-07-27' }
];

export default function AdminDeletedComment() {
    const rows = deletedComments.map(post => ({
        id : post.id,
        board: post.board,
        title: post.content,
        author: post.author,
        date: post.date,
    }));

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList/>
            </div>
            <div className={styles.content}>
                <h2>　삭제된 댓글 목록</h2>
                <AdminDeletedCommentTable rows={rows} />
            </div>
        </div>
    );
}
