package today.hca.java.domain.quiz.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import today.hca.java.domain.quiz.dto.AnswerResponseDto;
import today.hca.java.domain.quiz.dto.DailyQuizResponseDto;
import today.hca.java.domain.quiz.entity.Quiz;
import today.hca.java.domain.quiz.repository.QuizRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepository quizRepository;

    public DailyQuizResponseDto getQuizByDate(String date) {
        Quiz q = quizRepository.findQuizByDate(date);
        int count = 0;
        if(q.getWord3()!=null && !q.getWord3().equals("")){
            count = 3;
        }else if(q.getWord2()!=null && !q.getWord2().equals("")) {
            count = 2;
        }else {
            count = 1;
        }
        String[] indexes;
        String temp = q.getQuiz();
        if(count == 1) {
            temp = temp.replace(q.getWord1(), "^1");
            int i = q.getQuiz().indexOf(q.getWord1());
            indexes = new String[1];
            indexes[0] = "^1";
        }else if(count == 2) {
            temp = temp.replace(q.getWord1(), "^1");
            temp = temp.replace(q.getWord2(), "^2");
            int i1 = q.getQuiz().indexOf(q.getWord1());
            int i2 = q.getQuiz().indexOf(q.getWord2());
            indexes = new String[2];

            if(i1 > i2) {
                indexes[0] = "^2";
                indexes[1] = "^1";
            } else {
                indexes[0] = "^1";
                indexes[1] = "^2";
            }
            System.out.println(indexes[0]);
            System.out.println(indexes[1]);

        }else{
            temp = temp.replace(q.getWord1(), "^1");
            temp = temp.replace(q.getWord2(), "^2");
            temp = temp.replace(q.getWord3(), "^3");
            int i1 = q.getQuiz().indexOf(q.getWord1());
            int i2 = q.getQuiz().indexOf(q.getWord2());
            int i3 = q.getQuiz().indexOf(q.getWord3());
            indexes = new String[3];

            int max = 0;
            int min = 1000;
            max = Math.max(Math.max(i1, i2), i3);
            min = Math.min(Math.min(i1, i2), i3);


            int mid = i1+i2+i3 - max - min;
            if(max == i1) indexes[2] = "^1";
            if(max == i2) indexes[2] = "^2";
            if(max == i3) indexes[2] = "^3";

            if(mid == i1) indexes[1] = "^1";
            if(mid == i2) indexes[1] = "^2";
            if(mid == i3) indexes[1] = "^3";

            if(min == i1) indexes[0] = "^1";
            if(min == i2) indexes[0] = "^2";
            if(min == i3) indexes[0] = "^3";
        }

        DailyQuizResponseDto dto = DailyQuizResponseDto.builder().
        sentence(temp)
                .count(count)
                .indexes(indexes).build();

        return dto;
    }

	public AnswerResponseDto getAnswer(int winState, String date) {
        DailyQuizResponseDto dailyQuizResponseDto = getQuizByDate(date);

        Quiz quiz = quizRepository.findQuizByDate(date);
        String[] answers;

        if(dailyQuizResponseDto.getCount()==1) {
            answers = new String[1];
            answers[0] = quiz.getWord1();
        }else if(dailyQuizResponseDto.getCount() == 2) {
            answers = new String[2];
            answers[0] = quiz.getWord1();
            answers[1] = quiz.getWord2();
        } else {
            answers = new String[3];
            answers[0] = quiz.getWord1();
            answers[1] = quiz.getWord2();
            answers[2] = quiz.getWord3();
        }

        AnswerResponseDto dto = AnswerResponseDto.builder()
            .count(dailyQuizResponseDto.getCount())
            .answers(answers)
            .indexes(dailyQuizResponseDto.getIndexes())
            .build();
        return dto;
	}
}
