package today.hca.java.domain.news.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import today.hca.java.domain.quiz.entity.Quiz;

@Repository
public interface NewsRepository extends MongoRepository<Quiz, Integer> {
    @Query("{'date':  ?0}")
    public Quiz findQuizByDate(String date);

}
