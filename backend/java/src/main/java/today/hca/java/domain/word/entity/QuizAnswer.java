package today.hca.java.domain.word.entity;


import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import today.hca.java.global.model.BaseTimeEntity;

@Getter
@Document(collection="daily_quiz.history")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class QuizAnswer extends BaseTimeEntity {

    @Id
    private String id;
    private String date;
    private String quiz;
    private String word1;
    private String word2;
    private String word3;
}
