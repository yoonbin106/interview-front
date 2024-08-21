//adminReportedFinPostDetailsPage.jsx

import React from 'react';
import { useRouter } from 'next/router';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';
import AdminReportedFinPostDetails from '@/components/adminPage/adminReportedFinPostDetails';

export default function AdminReportedFinPostDetailsPage() {
    const router = useRouter();

    const handleDelete = () => {
        if (typeof window !== 'undefined') {
            if (window.confirm("게시글을 삭제하시겠습니까?")) {
                alert("게시글 삭제가 완료되었습니다.");
                router.push('/adminPage/adminReportedFinPostPage');
            }
        }
    };

    const handleHide = () => {
        if (typeof window !== 'undefined') {
            if (window.confirm("게시글을 숨기시겠습니까?")) {
                alert("게시글 숨김이 완료되었습니다.");
                router.push('/adminPage/adminReportedFinPostPage');
            }
        }
    };

    const handleBack = () => {
        router.push('/adminPage/adminReportedFinPostPage');
    };

    // 하드코딩된 게시글 정보
    const post = {
        title: "단 6개월만에 취업성공? ICT2기 절찬리에 모집중@@-->링크클릭",
        category: "광고",
        author: "user789",
        date: "2023-08-10",
        content: `요즘 취업이 어려운 상황 속에서 ICT2기 프로그램을 통해
        단 6개월만에 취업에 성공한 사례가 늘고 있습니다.
        이번 기회를 놓치지 마세요! 자세한 사항은 링크를 통해 확인해 주세요.`,
        reportReason: "광고성 게시물입니다.",
        reporter: "user123",
        reportDate: "2023-08-11"
    };

    return (
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList />
            </div>
            <div className={sidebar.content}>
                <AdminReportedFinPostDetails
                    post={post}  // 하드코딩된 게시글 정보 전달
                    onDelete={handleDelete}
                    onHide={handleHide}
                    onBack={handleBack}
                />
            </div>
        </div>
    );
}