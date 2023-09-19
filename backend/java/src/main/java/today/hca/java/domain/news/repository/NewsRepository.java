package today.hca.java.domain.news.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import today.hca.java.domain.news.entity.News;

@Repository
public interface NewsRepository extends MongoRepository<News, Integer> {
    @Query("{'date':  ?0}")
    public News findQuizByDate(String date);

}
