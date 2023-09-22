package today.hca.java.domain.news.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import today.hca.java.domain.news.dto.WordDto;
import today.hca.java.domain.news.entity.News;
import today.hca.java.domain.news.repository.NewsRepository;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;

    public static String getDate(int diff) {
        // diff 값 만큼 이전 날짜를 가져옴(0이면 오늘, 1이면 하루 전, 2면 이틀 전, 3이면 3일 전)
        ZoneId seoulZoneID = ZoneId.of("Asia/Seoul"); // 서울 표준 가져오기

        ZonedDateTime seoulTime = ZonedDateTime.now(seoulZoneID); // 서울 시간으로 지정
        ZonedDateTime previousTime = seoulTime.minusDays(diff); // diff 만큼 차이 가져오기

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");



        return previousTime.format(timeFormatter);
    }

    // todo -  수정중 2
    public List<News> getNewsByWord(WordDto wordDto) {

        List<News> newsByWordList;

        String word1 = wordDto.getWord1();
        String word2 = wordDto.getWord2();
        String word3 = wordDto.getWord3();

        // null처리
        if(word2 == null) {
            newsByWordList = newsRepository.findByWord(word1, getDate(0), getDate(1), getDate(2));

            return newsByWordList;
        } else if(word3 == null) {
            newsByWordList = newsRepository.findByWord(word1, word2, getDate(0), getDate(1), getDate(2));
            if(newsByWordList.size() < 3) return newsRepository.findByWord(word1, getDate(0), getDate(1), getDate(2));

        } else {
            // 우선 3개일 때 전부다 가져오기
            newsByWordList = newsRepository.findByWord(word1, word2, word3, getDate(0), getDate(1), getDate(2));

            if(newsByWordList.size() < 3) {
                newsByWordList =  newsRepository.findByWord(word1, word2, getDate(0), getDate(1), getDate(2));

                if(newsByWordList.size() < 3) return newsRepository.findByWord(word1, getDate(0), getDate(1), getDate(2));

                return newsByWordList;
            }
            return newsByWordList;

        }

        return newsByWordList;
    }
}

//              else {
//                    // 추후를 위한 기능 주석처리
//                    String[] compare = news.getTitle().replaceAll("[^가-힣\\s]", " ").trim().split("\\s+");
//                    System.out.println(Arrays.toString(compare));
//
//                    boolean isOk = false;
//                    // word2가 null일 때
//                    if(word2 == null) {
//                        for(String s : compare) {
//                            if(s.equals(word1)) isOk = true;
//                        }
//                    } else if(word3 == null) { // word3가 null일 때
//                        for(String s : compare) {
//                            if((s.equals(word1)) || s.equals(word2)) isOk = true;
//                        }
//                    } else {
//                        for(String s : compare) {
//                            if((s.equals(word1)) || s.equals(word2) || s.equals(word3)) isOk = true;
//                        }
//                    }
//
//                    if(!isOk) iterator.remove();
//                }

// 여기에 저장 - 가독성 좋고 속도 2.0 나옴
//        List<News> newsByWordList1 = newsRepository.findByWord(word1, getDate(0), getDate(1), getDate(2));
//        List<News> newsByWordList2;
//        List<News> newsByWordList3 = new ArrayList<>();
//
//
//        if(word2 == null) {
//            return newsByWordList1;
//        } else if(word3 == null) {
//            newsByWordList2 = newsRepository.findByWord(word1, word2, getDate(0), getDate(1), getDate(2));
//        } else {
//            newsByWordList2 = newsRepository.findByWord(word1, word2, getDate(0), getDate(1), getDate(2));
//            newsByWordList3 = newsRepository.findByWord(word1, word2, word3, getDate(0), getDate(1), getDate(2));
//        }
//
//        if(newsByWordList3.size() > 3) return newsByWordList3;
//        if(newsByWordList2.size() >2) return newsByWordList2;
//        return newsByWordList1;

