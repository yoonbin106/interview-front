//adminDeletePostPage.jsx
import React from 'react';
import { useRouter } from 'next/router';
import DeletedPostTable from '@/components/adminPage/adminDeletedPostTable';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

const deletedPosts = [
    {
      "id": 1,
      "title": "게시글 1",
      "author": "작성자 1",
      "date": "2023-08-01",
      "content": "내용 1"
    },
    {
      "id": 2,
      "title": "게시글 2",
      "author": "작성자 2",
      "date": "2023-07-15",
      "content": "내용 2"
    },
    {
      "id": 3,
      "title": "게시글 3",
      "author": "작성자 3",
      "date": "2023-06-30",
      "content": "내용 3"
    },
    {
      "id": 4,
      "title": "게시글 4",
      "author": "작성자 4",
      "date": "2023-06-20",
      "content": "내용 4"
    },
    {
      "id": 5,
      "title": "게시글 5",
      "author": "작성자 5",
      "date": "2023-05-10",
      "content": "내용 5"
    },
    {
      "id": 6,
      "title": "게시글 6",
      "author": "작성자 6",
      "date": "2023-04-22",
      "content": "내용 6"
    },
    {
      "id": 7,
      "title": "게시글 7",
      "author": "작성자 7",
      "date": "2023-03-18",
      "content": "내용 7"
    },
    {
      "id": 8,
      "title": "게시글 8",
      "author": "작성자 8",
      "date": "2023-02-27",
      "content": "내용 8"
    },
    {
      "id": 9,
      "title": "게시글 9",
      "author": "작성자 9",
      "date": "2023-01-15",
      "content": "내용 9"
    },
    {
      "id": 10,
      "title": "게시글 10",
      "author": "작성자 10",
      "date": "2022-12-05",
      "content": "내용 10"
    }
  ]
  export default function AdminDeletedPostPage() {
    const router = useRouter();

    const rows = deletedPosts.map(post => ({
        id: post.id,
        title: post.title,
        author: post.author,
        date: post.date,
        onClick: () => router.push(`/adminPage/adminDeletedPostDetailPage`), // 특정 ID 없이 고정된 경로로 이동
    }));

    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
            <NestedList/>
        </div>
        <div className={styles.content}>
            <h2>삭제된 게시글 목록</h2>
            <DeletedPostTable rows={rows} />
        </div>
      </div>
    );
}