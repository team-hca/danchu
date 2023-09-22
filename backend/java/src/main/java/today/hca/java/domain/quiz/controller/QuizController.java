package today.hca.java.domain.quiz.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import today.hca.java.domain.quiz.dto.DailyQuizResponseDto;
import today.hca.java.domain.quiz.entity.Quiz;
import today.hca.java.domain.quiz.service.QuizService;

@RestController
@RequestMapping("/api/v1/quiz")
@RequiredArgsConstructor
@CrossOrigin
public class QuizController {
    private final QuizService quizService;

    @GetMapping("/today")
    public ResponseEntity<?> getQuizByDate(@RequestParam String date) {
        System.out.println("datae: " + date);
        DailyQuizResponseDto quiz = quizService.getQuizByDate(date);
        System.out.println("quiz: " + quiz.toString());

        return new ResponseEntity( quiz, HttpStatus.OK);
    }
}
