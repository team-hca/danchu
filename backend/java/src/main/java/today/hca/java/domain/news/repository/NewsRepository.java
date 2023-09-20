package today.hca.java.domain.news.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import today.hca.java.domain.news.entity.News;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;


@Repository
public interface NewsRepository extends MongoRepository<News, String> {

    @Query("{'$and' : " +
            "[" +
            "{'title' :  {$regex :  ?0}}, " +
            "{'date' : { $in : [?1, ?2, ?3]}}"+
            "]}")
    List<News> findByWord(String word1, String date1, String date2, String date3);

    @Query("{'$and' : " +
            "[" +
            "{'title' :  {$regex :  ?0}}, " +
            "{'title' :  {$regex :  ?1}}, " +
            "{'date' : { $in : [?2, ?3, ?4]}}"+
            "]}")
    List<News> findByWord(String word1, String word2, String date1, String date2, String date3);

    @Query("{'$and' : " +
            "[" +
            "{'title' :  { $regex :  ?0 }}, " +
            "{'title' :  { $regex :  ?1 }}, " +
            "{'title' :  { $regex :  ?2 }}," +
            "{'date' : { $in : [?3, ?4, ?5]}}"+
            "]}")
    List<News> findByWord(String word1, String word2, String word3, String date1, String date2, String date3);






}
