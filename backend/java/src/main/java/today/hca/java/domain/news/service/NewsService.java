package today.hca.java.domain.news.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import today.hca.java.domain.news.dto.WordDto;
import today.hca.java.domain.news.entity.News;
import today.hca.java.domain.news.repository.NewsRepository;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
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

        String date = previousTime.format(timeFormatter);

        return date;
    }

    // todo -  수정중 2
    public List<News> getNewsByWord(WordDto wordDto) {

        // 여기에 저장
        List<News> newsByWordList;

        String word1 = wordDto.getWord1();
        String word2 = wordDto.getWord2();
        String word3 = wordDto.getWord3();


        // null처리
        if(word2 == null) {
            newsByWordList = newsRepository.findByWord(word1);
        } else if(word3 == null) {
            newsByWordList = newsRepository.findByWord(word1, word2);
        } else {
            newsByWordList = newsRepository.findByWord(word1, word2, word3);
        }

        System.out.println("가져온 뉴스 Size : " + newsByWordList.size());

        if(newsByWordList.size() == 0) {
            System.out.println("service : 못 가져온다");
        } else {
            Iterator<News> iterator = newsByWordList.iterator();
            while(iterator.hasNext()) {
                News news = iterator.next();

                // 3일 전 뉴스까지 가져오기
                if(!(news.getDate().equals(getDate(0))) &&
                        !(news.getDate().equals(getDate(1))) &&
                        !(news.getDate().equals(getDate(2)))) {
                    iterator.remove();
                }

//                else {
//                    // todo : 정확히 일치하는 단어로 가져오기 - 구현해야 할지 아직 확신이 안 섬, 기사를 못 가져오는 경우가 많음
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

            }
        }

//            for(News news: combinedList) {
////                System.out.println("처리 전 : " + news.getTitle());
//                String title = news.getTitle();
//
//                title = title.replaceAll("[^가-힣\\s]", "").strip().trim(); // 한글만 가져와
//
//                if(title.length() == 0) {
////                    System.out.println("타이틀 없애버렸음");
//                    continue;
//                }
//
////                System.out.println("처리 후 : " + title);
//
//                String[] textString = title.split(" "); // 띄어쓰기 단위로 타이틀 가져와
//
//                // 단어 위로 쪼개서 정확히 일치하는 단어위주로 가져오기
//                for(String temp : textString) {
//                    if (temp != null && (temp.equals(word1) || (word2 != null && temp.equals(word2)) || (word3 != null && temp.equals(word3)))) {
//                        newsByWordList.add(news);
////                        System.out.println("넣습니다 : " + title);
//                    }
//                }
//            }


        System.out.println("담긴 뉴스 Size : " + newsByWordList.size());


        return newsByWordList;
    }

}
