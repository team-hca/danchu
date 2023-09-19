package today.hca.java.domain.news.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import today.hca.java.domain.news.entity.News;
import today.hca.java.domain.news.service.NewsService;
import today.hca.java.domain.quiz.service.QuizService;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsController {
    private final NewsService newsService;

    @GetMapping("/today")
    public ResponseEntity<?> getQuizByDate(@RequestParam String date) {
        System.out.println("date: " + date);
        News news = newsService.getQuizByDate(date);
        System.out.println("news: " + news.toString());

        return new ResponseEntity(news, HttpStatus.OK);
    }
}
