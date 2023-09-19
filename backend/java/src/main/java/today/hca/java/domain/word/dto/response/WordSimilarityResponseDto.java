package today.hca.java.domain.word.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WordSimilarityResponseDto {
    private boolean isItAnswer;
    private double similarity;
    private String word;
}
