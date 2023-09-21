package today.hca.java.domain.word.entity;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Getter
@Document(collection="daily_words_similarity_top1000.history")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class Similarity1000 {
    @Id
    private String id;
    private String date;
    private String word1;
    private String word2;
    private String word3;
    private List<String[]> word1_top1000;
    private List<String[]> word2_top1000;
    private List<String[]> word3_top1000;
    private String created_at;
    private String modified_at;

}
