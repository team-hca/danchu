package today.hca.java.domain.word.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import today.hca.java.domain.word.service.WordService;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    @GetMapping("/guess")
    public ResponseEntity<?> wordGuess(@RequestParam String quizNum, @RequestParam String guessWord) {

    }
}
