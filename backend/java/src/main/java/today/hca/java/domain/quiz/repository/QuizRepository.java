//package today.hca.java.domain.quiz.repository;
//
//import org.springframework.data.mongodb.repository.MongoRepository;
//import org.springframework.data.mongodb.repository.Query;
//import org.springframework.stereotype.Repository;
//import today.hca.java.domain.quiz.entity.Quiz;
//
//import java.util.List;
//
//@Repository
//public interface QuizRepository extends MongoRepository<Quiz, Integer> {
//    @Query("{'date':  ?0}")
//    public Quiz findQuizByDate(String date);
//
//}
