package today.hca.java.domain.word.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WordSimilarity {
    private String word;
    private String similarity;
}
