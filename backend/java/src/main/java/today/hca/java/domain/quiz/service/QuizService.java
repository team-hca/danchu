package today.hca.java.domain.quiz.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import today.hca.java.domain.quiz.dto.DailyQuizResponseDto;
import today.hca.java.domain.quiz.entity.Quiz;
import today.hca.java.domain.quiz.repository.QuizRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepository quizRepository;

    public DailyQuizResponseDto getQuizByDate(String date) {
//        List<Quiz> list = quizRepository.findAll();
//        for(Quiz q: list) {
//            System.out.println(q.toString());
//        }
        Quiz q = quizRepository.findQuizByDate(date);
        int count = 0;
        if(q.getWord3()!=null || !q.getWord3().equals("")){
            count = 3;
        }else if(q.getWord2()!=null || !q.getWord3().equals("")) {
            count = 2;
        }else {
            count = 1;
        }
        int[] newIndexes;
        String[] newSentences;
        if(count == 1) {
            newSentences = new String[2];
            String s = q.getQuiz();
            String w = q.getWord1();
            newSentences = s.split(w);
            newIndexes = new int[1];
            newIndexes[0] = s.indexOf(q.getWord1());
        }else if(count == 2) {
            newSentences = new String[3];
            String s = q.getQuiz();
            String w1 = q.getWord1();
            String w2 = q.getWord2();
            String firstPiece = s.split(q.getWord1())[0];
            String secondPiece = s.split(q.getWord1())[1];
            newSentences[0] = firstPiece;
            newSentences[1] = secondPiece.split(q.getWord2())[0];
            newSentences[2] = secondPiece.split(q.getWord2())[1];
            newIndexes = new int[2];
            newIndexes[0] = s.indexOf(q.getWord1());
            newIndexes[1] = s.indexOf(q.getWord2());
        }else {
            newSentences = new String[4];
            String s = q.getQuiz();
            String w1 = q.getWord1();
            String w2 = q.getWord2();
            String w3 = q.getWord3();

            String firstPiece = s.split(q.getWord1()) [0];
            String secondPiece = (s.split(q.getWord1())[1]).split(q.getWord2()) [0];
            String thirdPiece = (s.split(q.getWord1())[1]).split(q.getWord2()) [1].split(q.getWord3())[0];
            String fourthPiece = (s.split(q.getWord1())[1]).split(q.getWord2()) [1].split(q.getWord3())[1];
            newSentences[0] = firstPiece;
            newSentences[1] = secondPiece;
            newSentences[2] = thirdPiece;
            newSentences[3] = fourthPiece;
            newIndexes = new int[3];
            newIndexes[0] = s.indexOf(q.getWord1());
            newIndexes[1] = s.indexOf(q.getWord2());
            newIndexes[2] = s.indexOf(q.getWord3());

        }

        DailyQuizResponseDto dto = DailyQuizResponseDto.builder().
        sentence(newSentences)
                .count(count)
                .indexes(newIndexes).build();

        return dto;
    }
}
