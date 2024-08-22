import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchMainEconomicNews() {
    console.log('1. [API 시작] fetchMainEconomicNews 함수가 호출되었습니다.');

    try {
        console.log('2. [크롤링 시작] axios로 HTML 가져오기');

        const response = await axios.get('https://www.yna.co.kr/economy/job-foundation');
        console.log('3. [크롤링 성공] HTML 데이터를 성공적으로 가져왔습니다.');

        const html = response.data;
        const $ = cheerio.load(html);
        const newsList = [];

        console.log('4. [HTML 파싱 시작] Cheerio를 이용해 HTML을 파싱합니다.');

        $('ul.list > li').each((index, element) => {
            const time = $(element).find('span.txt-time').text().trim();
            const title = $(element).find('strong.tit-news').text().trim();
            const link = $(element).find('a').attr('href');
            let imgUrl = $(element).find('a.img-cover img').attr('src');

            // 비어 있는 항목이 있는 경우 해당 항목을 제외
            if (!time || !title || !link) {
                console.log(`x. [항목 제거] ${index + 1}번째 뉴스 항목이 누락되어 목록에서 제거되었습니다.`);
                return;  // 이 항목을 건너뛰고 다음 항목으로 이동
            }

            console.log(`5. [뉴스 시간 추출] ${index + 1}번째 뉴스 시간: ${time}`);
            console.log(`6. [뉴스 제목 추출] ${index + 1}번째 뉴스 제목: ${title}`);
            console.log(`7. [뉴스 링크 추출] ${index + 1}번째 뉴스 링크: ${link}`);

            if (imgUrl === undefined) {
                imgUrl = '/images/default.jpg';  // 기본 이미지 경로
                console.log(`8. [뉴스 이미지 대체] ${index + 1}번째 뉴스 이미지가 없어서 기본 이미지로 대체되었습니다.`);
            } else {
                console.log(`8. [뉴스 이미지 추출] ${index + 1}번째 뉴스 이미지 URL: ${imgUrl}`);
            }

            newsList.push({
                title,
                link,  // 절대 경로를 사용하지 않음
                imgUrl,
                time,
            });
            console.log(`9. [뉴스 아이템 추가] ${index + 1}번째 뉴스 아이템이 목록에 추가되었습니다.`);
        });

        console.log(`10. [추출된 뉴스 아이템 개수] 총 ${newsList.length}개의 뉴스 아이템이 추출되었습니다.`);
        return newsList;
    } catch (error) {
        console.error('11. [오류 발생] fetchMainEconomicNews 함수 오류:', error.message);
        throw new Error('Failed to fetch main economic news');
    }
}
