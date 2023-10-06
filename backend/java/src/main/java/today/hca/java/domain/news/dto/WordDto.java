package today.hca.java.domain.news.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
//@Data
public class WordDto {

    // 빈칸 금지 정규식 추가

    @NotBlank
    @Pattern(regexp = "^\\S+$")
    private String word1;
    @Pattern(regexp = "^\\S+$")
    private String word2;
    @Pattern(regexp = "^\\S+$")
    private String word3;

}
