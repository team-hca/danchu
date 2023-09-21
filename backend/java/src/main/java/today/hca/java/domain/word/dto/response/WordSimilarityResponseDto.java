package today.hca.java.domain.word.dto.response;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WordSimilarityResponseDto {
    private boolean isItAnswer;
    private double similarity;
    private String word;
}
