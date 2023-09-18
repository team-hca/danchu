package today.hca.java.domain.quiz.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import today.hca.java.domain.quiz.entity.Quiz;
import today.hca.java.domain.quiz.repository.QuizRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepository quizRepository;

    public Quiz getQuizByDate(String date) {
        List<Quiz> list = quizRepository.findAll();
        for(Quiz q: list) {
            System.out.println(q.toString());
        }
        return quizRepository.findQuizByDate(date);
    }
}
