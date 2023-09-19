package today.hca.java.domain.news.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import today.hca.java.domain.news.entity.News;

import java.util.List;


@Repository
public interface NewsRepository extends MongoRepository<News, String> {

//    @Query
//    public List<News> findByDate(String date);

    // todo - 수정중 작업
    @Query("{'$or' : " +
            "[" +
            "{'title' :  {$regex :  ?0}}, " +
            "{'title' :  {$regex :  ?1}}, " +
            "{'title' :  {$regex :  ?2}}" +
            "]" +
            "}")
    List<News> findByTitleContainsWord(String word1, String word2, String word3);


}
