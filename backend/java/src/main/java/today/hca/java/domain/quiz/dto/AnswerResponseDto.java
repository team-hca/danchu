package today.hca.java.domain.quiz.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AnswerResponseDto {
	private int count;
	private String[] answers;
	private String[] indexes;
	private String message;
}
