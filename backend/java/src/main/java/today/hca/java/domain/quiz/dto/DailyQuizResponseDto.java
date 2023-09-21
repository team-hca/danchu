package today.hca.java.domain.quiz.dto;

import lombok.*;

@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@ToString
public class DailyQuizResponseDto {
    private String[] sentence;
    private int count;
    private int[] indexes;
}
