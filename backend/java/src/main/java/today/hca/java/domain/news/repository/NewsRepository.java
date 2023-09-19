package today.hca.java.domain.news.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import today.hca.java.domain.news.entity.News;

import java.util.List;


@Repository
public interface NewsRepository extends MongoRepository<News, String> {

    @Query
    public List<News> findByDate(String date);

}
