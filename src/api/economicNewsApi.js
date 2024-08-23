// import axios from 'axios';
// import * as cheerio from 'cheerio';  // ES 모듈 방식으로 cheerio 임포트

// // 기본 대체 이미지 URL (이미지를 넣은 위치를 지정하세요)
// const defaultImageUrl = '/images/default.jpg';

// export const fetchEconomicNews = async () => {
//     try {
//         //console.log('Starting to fetch economic news from Naver...');

//         // Step 1: Axios 요청
//         let response;
//         try {
//             response = await axios.get('https://news.naver.com/breakingnews/section/101/261');
//             //console.log('Received response from Naver with status:', response.status);
//         } catch (axiosError) {
//             //console.error('Axios request failed:', axiosError.message);
//             throw new Error('Failed to fetch page from Naver');
//         }

//         // Step 2: HTML 파싱
//         let $;
//         try {
//             $ = cheerio.load(response.data);
//             //console.log('Successfully loaded HTML with cheerio.');

//             // Step 3: HTML 구조 출력 (초기 500자만 출력해서 확인)
//             //console.log('HTML 구조 일부:', response.data.slice(0, 500));
//         } catch (cheerioError) {
//             //console.error('Cheerio failed to parse HTML:', cheerioError.message);
//             throw new Error('Failed to parse HTML');
//         }

//         const newsList = [];

//         // Step 4: 셀렉터로 뉴스 항목, 이미지 URL, 기사 작성 단체 및 시간 파싱
//         try {
//             $('li.sa_item').each((index, element) => {
//                 const title = $(element).find('div.sa_text > a').text().trim();
//                 const link = $(element).find('div.sa_text > a').attr('href');
//                 let imgUrl = $(element).find('div.sa_thumb img').attr('data-src'); // 이미지 URL 가져오기
//                 const press = $(element).find('div.sa_text_press').text().trim(); // 기사 작성 단체 가져오기
//                 const time = $(element).find('div.sa_text_datetime').text().trim(); // 시간 가져오기

//                 // 이미지 URL이 없는 경우 대체 이미지로 설정
//                 if (!imgUrl) {
//                     imgUrl = defaultImageUrl;
//                 }

//                //console.log(`Parsed news item ${index + 1}:`, { title, link, imgUrl, press, time });
//                 newsList.push({ title, link, imgUrl, press, time });
//             });

//             //console.log('Total news items parsed:', newsList.length);
//         } catch (parsingError) {
//             //console.error('Failed to parse news items:', parsingError.message);
//             throw new Error('Failed to parse news items');
//         }

//         // Step 5: 결과 반환
//         return newsList;
//     } catch (error) {
//         //console.error('Error in fetchEconomicNews:', error.message);
//         throw error;
//     }
// };