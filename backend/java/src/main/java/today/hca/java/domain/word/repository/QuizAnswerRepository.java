package today.hca.java.domain.word.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import today.hca.java.domain.word.entity.QuizAnswer;

@Repository
public interface QuizAnswerRepository extends MongoRepository<QuizAnswer, Integer> {

    public QuizAnswer findByDate(String date);

}
