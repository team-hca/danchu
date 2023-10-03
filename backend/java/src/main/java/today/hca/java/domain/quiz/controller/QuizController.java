package today.hca.java.domain.quiz.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import today.hca.java.domain.quiz.dto.AnswerResponseDto;
import today.hca.java.domain.quiz.dto.DailyQuizResponseDto;
import today.hca.java.domain.quiz.service.QuizService;

@RestController
@RequestMapping("/v1/quiz")
@RequiredArgsConstructor
@CrossOrigin
public class QuizController {
    private final QuizService quizService;

    @GetMapping("/today")
    public ResponseEntity<?> getQuizByDate(@RequestParam String date) {
        DailyQuizResponseDto quiz = quizService.getQuizByDate(date);
        return new ResponseEntity( quiz, HttpStatus.OK);
    }

    @GetMapping("/answer")
    public ResponseEntity<?> getAnswerForGiveUp(@RequestParam int winState, @RequestParam String date) {
        AnswerResponseDto quiz;
        if (winState == 0) {
            quiz = quizService.getAnswer(winState, date);
            return new ResponseEntity<>(quiz, HttpStatus.OK);
        }
        return new ResponseEntity<>(AnswerResponseDto.builder().message("포기 상태가 아닙니다").build(), HttpStatus.BAD_REQUEST);
    }
}
