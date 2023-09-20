package today.hca.java.domain.news.entity;

import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import today.hca.java.global.model.BaseTimeEntity;

import java.time.LocalDateTime;


@Getter
@Document(collection="news.history")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
// todo : createAt , updateAt이 null 값으로 전달되는 부분 수정 필요
public class News {

    @Id
    private String id; // ID
    private String title; // 뉴스 제목
    private String url; // 뉴스 주소
    private String date; // 뉴스 날짜
    private String content; // 뉴스 내용
    private String date_time;
    private String created_at;
    private String modified_at;

}
