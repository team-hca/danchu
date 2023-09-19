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

//    public List<News> getNewsByWord(WordDto wordDto) {
//
//        // 여기에 저장
//        List<News> combinedList = new ArrayList<>();
//        List<News> tempList = new ArrayList<>();
//
//        // combined에 전부 저장
//        for(int i = 0; i < 3; i++) {
//            System.out.println(getDate(i));
//            tempList = newsRepository.findByDate(getDate(i));
//            combinedList.addAll(tempList);
//        }
//
//        List<News> newsByWordList = new ArrayList<>();
//
//        String word1 = wordDto.getWord1();
//        String word2 = wordDto.getWord2();
//        String word3 = wordDto.getWord3();
//
//
//        if(combinedList.size() == 0) {
//            System.out.println("service : 못 가져온다");
//        } else {
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
//        }
//
//        System.out.println("가져온 뉴스 Size : " + combinedList.size());
//        System.out.println("담긴 뉴스 Size : " + newsByWordList.size());
//
//
//        return newsByWordList;
//    }

    // todo -  수정중 2
    public List<News> getNewsByWord(WordDto wordDto) {

        // 여기에 저장
        List<News> combinedList = new ArrayList<>();
        List<News> tempList = new ArrayList<>();



        List<News> newsByWordList = new ArrayList<>();

        String word1 = wordDto.getWord1();
        String word2 = wordDto.getWord2();
        String word3 = wordDto.getWord3();

        combinedList = newsRepository.findByTitleContainsWord(word1);

        if(combinedList.size() == 0) {
            System.out.println("service : 못 가져온다");
        } else {
            for(News news: combinedList) {
//                System.out.println("처리 전 : " + news.getTitle());
                String title = news.getTitle();

                title = title.replaceAll("[^가-힣\\s]", "").strip().trim(); // 한글만 가져와

                if(title.length() == 0) {
//                    System.out.println("타이틀 없애버렸음");
                    continue;
                }

//                System.out.println("처리 후 : " + title);

                String[] textString = title.split(" "); // 띄어쓰기 단위로 타이틀 가져와

                // 단어 위로 쪼개서 정확히 일치하는 단어위주로 가져오기
                for(String temp : textString) {
                    if (temp != null && (temp.equals(word1) || (word2 != null && temp.equals(word2)) || (word3 != null && temp.equals(word3)))) {
                        newsByWordList.add(news);
//                        System.out.println("넣습니다 : " + title);
                    }
                }
            }
        }

        System.out.println("가져온 뉴스 Size : " + combinedList.size());
        System.out.println("담긴 뉴스 Size : " + newsByWordList.size());


        return newsByWordList;
    }

}
