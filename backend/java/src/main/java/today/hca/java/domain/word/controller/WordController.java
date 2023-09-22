package today.hca.java.domain.word.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import today.hca.java.domain.word.dto.response.WordSimilarityResponseDto;
import today.hca.java.domain.word.service.WordService;

import java.io.IOException;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/v1/word")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    @GetMapping("/guess")
    public ResponseEntity<?> wordGuess(@RequestParam String quizNum, @RequestParam String guessWord) throws URISyntaxException, IOException, InterruptedException {
        System.out.println("datae: ");
        WordSimilarityResponseDto wordSimilarityResponseDto=wordService.wordGuess(quizNum,guessWord);
        System.out.println("결과값: " + wordSimilarityResponseDto.toString());

        return new ResponseEntity(wordSimilarityResponseDto, HttpStatus.OK);
    }

}
