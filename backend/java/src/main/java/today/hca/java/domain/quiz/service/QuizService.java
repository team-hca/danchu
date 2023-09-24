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



//            indexes[0] = Math.min(Math.min(i1, i2), i3);
//            indexes[2] = Math.max(Math.max(i1, i2), i3);
//            if(indexes[0] != i1 && indexes[2] != i1) {
//                indexes[1] = i1;
//            }else if(indexes[0] != i2 && indexes[2] != i2) {
//                indexes[1] = i2;
//            }else{
//                indexes[1] = i3;
//            }

        }

//        int[] newIndexes;
//        String[] newSentences;
//        if(count == 1) {
//            String s = q.getQuiz();
//            newIndexes = new int[1];
//            newIndexes[0] = s.indexOf(q.getWord1());
//            newSentences = new String[2];
//            // 답이 한 개일 때 index 0, 중간, index 마지막
//            if(newIndexes[0]==0) {
//                newSentences[0] = "";
//                newSentences[1] = s;
//            }else if(newIndexes[0]==s.length()-1) {
//                newSentences[0] = s;
//                newSentences[1] = "";
//            }else {
//                newSentences = s.split(q.getWord1());
//            }
//
//        }else if(count == 2) {
//            String s = q.getQuiz();
//            String w1 = q.getWord1();
//            String w2 = q.getWord2();
//            String arr = s.split(q.getWord1())[0];
//            newSentences = new String[3];
//            if(arr.length()==2) {
//                String firstPiece = s.split(q.getWord1())[0];
//                String secondPiece = s.split(q.getWord1())[1];
//                newSentences[0] = firstPiece;
//                newSentences[1] = secondPiece.split(q.getWord2())[0];
//                newSentences[2] = secondPiece.split(q.getWord2())[1];
//                newIndexes = new int[2];
//                newIndexes[0] = s.indexOf(q.getWord1());
//                newIndexes[1] = s.indexOf(q.getWord2());
//            }else{
//                newIndexes = new int[2];
//                newIndexes[0] = s.indexOf(q.getWord1());
//                newIndexes[1] = s.indexOf(q.getWord2());
//                if(newIndexes[0]==0) {
//
//                }
//            }
//
//        }else {
//            newSentences = new String[4];
//            String s = q.getQuiz();
//            String w1 = q.getWord1();
//            String w2 = q.getWord2();
//            String w3 = q.getWord3();
//
//            String firstPiece = s.split(q.getWord1()) [0];
//            String secondPiece = (s.split(q.getWord1())[1]).split(q.getWord2()) [0];
//            String thirdPiece = (s.split(q.getWord1())[1]).split(q.getWord2()) [1].split(q.getWord3())[0];
//            String fourthPiece = (s.split(q.getWord1())[1]).split(q.getWord2()) [1].split(q.getWord3())[1];
//            newSentences[0] = firstPiece;
//            newSentences[1] = secondPiece;
//            newSentences[2] = thirdPiece;
//            newSentences[3] = fourthPiece;
//            newIndexes = new int[3];
//            newIndexes[0] = s.indexOf(q.getWord1());
//            newIndexes[1] = s.indexOf(q.getWord2());
//            newIndexes[2] = s.indexOf(q.getWord3());
//
//        }

        DailyQuizResponseDto dto = DailyQuizResponseDto.builder().
        sentence(temp)
                .count(count)
                .indexes(indexes).build();

        return dto;
    }
}
