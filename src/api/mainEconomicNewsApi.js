import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchMainEconomicNews() {
 

    try {
     

        const response = await axios.get('https://www.yna.co.kr/economy/job-foundation');
     

        const html = response.data;
        const $ = cheerio.load(html);
        const newsList = [];

     

        $('ul.list > li').each((index, element) => {
            const time = $(element).find('span.txt-time').text().trim();
            const title = $(element).find('strong.tit-news').text().trim();
            const link = $(element).find('a').attr('href');
            let imgUrl = $(element).find('a.img-cover img').attr('src');

            // 비어 있는 항목이 있는 경우 해당 항목을 제외
            if (!time || !title || !link) {
              
                return;  // 이 항목을 건너뛰고 다음 항목으로 이동
            }

            

            if (imgUrl === undefined) {
                imgUrl = '/images/default.jpg';  // 기본 이미지 경로
               
            } else {
            
            }

            newsList.push({
                title,
                link,  // 절대 경로를 사용하지 않음
                imgUrl,
                time,
            });
          
        });

        
        return newsList;
    } catch (error) {
    
        throw new Error('Failed to fetch main economic news');
    }
}
