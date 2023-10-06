package today.hca.java.domain.word.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import today.hca.java.domain.word.entity.Similarity1000;

@Repository
public interface WordSimilarityRepository extends MongoRepository<Similarity1000, Integer> {
    public Similarity1000 findByDate(String date);

    @Query(value="{ 'date' : ?0 }", fields="{ 'word1_top1000' : 1 }")
    Similarity1000 findByDateAndReturnWord1Top1000Only(String date);

    @Query(value="{ 'date' : ?0 }", fields="{ 'word2_top1000' : 1 }")
    Similarity1000 findByDateAndReturnWord2Top1000Only(String date);

    @Query(value="{ 'date' : ?0 }", fields="{ 'word3_top1000' : 1 }")
    Similarity1000 findByDateAndReturnWord3Top1000Only(String date);

    @Query(value="{ 'date' : ?0 }", fields="{ 'word1_1000' : 1 }")
    Similarity1000 findByDateAndReturnWord1LastSimilarityOnly(String date);

    @Query(value="{ 'date' : ?0 }", fields="{ 'word2_1000' : 1 }")
    Similarity1000 findByDateAndReturnWord2LastSimilarityOnly(String date);

    @Query(value="{ 'date' : ?0 }", fields="{ 'word3_1000' : 1 }")
    Similarity1000 findByDateAndReturnWord3LastSimilarityOnly(String date);

}
