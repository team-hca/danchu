package today.hca.java.domain.news.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import today.hca.java.domain.quiz.entity.Quiz;
import today.hca.java.domain.quiz.service.QuizService;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsController {
    private final QuizService quizService;

    @GetMapping("/news")
    public ResponseEntity<?> getNewsByAnswer(@RequestParam String ansewr) {
        System.out.println("date: " + ansewr);
        Quiz quiz = quizService.getQuizByDate(ansewr);
        System.out.println("quiz: " + quiz.toString());

        return new ResponseEntity(quiz, HttpStatus.OK);
    }
}
