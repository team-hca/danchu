package today.hca.java.domain.news.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import today.hca.java.domain.news.dto.WordDto;
import today.hca.java.domain.news.entity.News;
import today.hca.java.domain.news.service.NewsService;

import java.util.List;

@RestController
@RequestMapping("/v1/news")
@RequiredArgsConstructor
public class NewsController {
    private final NewsService newsService;

    @GetMapping("/link")
    public ResponseEntity<?> getNewsByWord(@ModelAttribute @Valid WordDto wordDto) {
        System.out.println("NewsController - getNewsByWord 실행");
        long startTime = System.nanoTime();
        String word1 = wordDto.getWord1();
        String word2 = wordDto.getWord2();
        String word3 = wordDto.getWord3();

        System.out.println("word1: " + word1);
        System.out.println("word2: " + word2);
        System.out.println("word3: " + word3);

        List<News> newsList;

        newsList = newsService.getNewsByWord(wordDto);

        if(newsList == null) {
            System.out.println("뉴스가 없습니다.");
            return new ResponseEntity<>("FAIL", HttpStatus.NO_CONTENT);
        }
        long endTime = System.nanoTime();
        long duration = endTime - startTime;
        double milliseconds = duration / 1e9;

        System.out.println("NewsController - getNewsByWord 종료");
        System.out.println("수행 시간 : " + milliseconds+"sec");

        return new ResponseEntity(newsList, HttpStatus.OK);
    }
}
