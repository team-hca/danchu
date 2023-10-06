package today.hca.java.domain.word.service;

import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.stereotype.Service;
import today.hca.java.domain.word.dto.response.WordSimilarityResponseDto;
import today.hca.java.domain.word.entity.QuizAnswer;
import today.hca.java.domain.word.repository.QuizAnswerRepository;
import today.hca.java.domain.word.repository.WordSimilarityRepository;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class WordService {
    private final QuizAnswerRepository quizAnswerRepository;
    private final WordSimilarityRepository wordSimilarityRepository;
    public WordSimilarityResponseDto wordGuess(String quizNum, String guessWord) throws URISyntaxException, IOException, InterruptedException, IllegalArgumentException {

        String pattern = "^[가-힣]*$"; // 한글만 등장하는지

        boolean result = Pattern.matches(pattern, guessWord);

        if (!result) {
            throw new IllegalArgumentException("올바르지 않은 입력입니다.");
        }

        WordSimilarityResponseDto resultDto = new WordSimilarityResponseDto();
        //입력 단어가 정답인지 확인
        //오늘의 날짜를 변수 값으로 넣어야함!
        QuizAnswer todayQuiz = quizAnswerRepository.findByDate(getDate());
        //오늘의 퀴즈 데이터를 가지고와서 퀴즈num에 맞는 데이터 비교
        switch (Integer.parseInt(quizNum)) { // 정답인 경우
            case 1 -> {
                if (todayQuiz.getWord1().equals(guessWord)) {
                    resultDto.setItAnswer(true);
                    resultDto.setSimilarity(100);
                    resultDto.setWord(guessWord);
                    resultDto.setRank(0);
                    return resultDto;
                }
            }
            case 2 -> {
                if (todayQuiz.getWord2().equals(guessWord)) {
                    resultDto.setItAnswer(true);
                    resultDto.setSimilarity(100);
                    resultDto.setWord(guessWord);
                    resultDto.setRank(0);
                    return resultDto;
                }
            }
            case 3 -> {
                if (todayQuiz.getWord3().equals(guessWord)) {
                    resultDto.setItAnswer(true);
                    resultDto.setSimilarity(100);
                    resultDto.setWord(guessWord);
                    resultDto.setRank(0);
                    return resultDto;
                }
            }
        }

        // 정답 아닌 경우
        double lastSimilarity = 100; // simialrity 범위 -1 ~ 1 이므로 * 100 한 100으로 초기화
        String answer="";
                switch (Integer.parseInt(quizNum)) {
            case 1 -> {
               answer = todayQuiz.getWord1();
               lastSimilarity = wordSimilarityRepository.findByDateAndReturnWord1LastSimilarityOnly(getDate()).getWord1_1000() * 100;
            }
            case 2 -> {
                answer = todayQuiz.getWord2();
                lastSimilarity = wordSimilarityRepository.findByDateAndReturnWord2LastSimilarityOnly(getDate()).getWord2_1000() * 100;
            }
            case 3 -> {
                answer = todayQuiz.getWord3();
                lastSimilarity = wordSimilarityRepository.findByDateAndReturnWord3LastSimilarityOnly(getDate()).getWord3_1000() * 100;
            }
        }
        String word =guessWord;

        //없다면 유사도 모델에서 반환값 받기
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("http://j9a302.p.ssafy.io:8083/api/v1/ai/wordSimilarity/"+ answer +"/"+word))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();

        Document doc = Document.parse(responseBody);

        String answerFromResponse = doc.getString("정답");
        String inputValue = doc.getString("입력값");
        double similarityValue = doc.getDouble("유사도");
        int rankValue = doc.getInteger("순위");

        resultDto.setWord(inputValue);
        resultDto.setSimilarity(similarityValue * 100); // 백분율로 반환하도록 * 100
        resultDto.setItAnswer(false);
        resultDto.setRank(rankValue);

        // 1000위 유사도와 비교해서 순위 수정
        if (resultDto.getRank() == -1 && resultDto.getSimilarity() >= lastSimilarity) {
            resultDto.setRank(-2);
        }

        return resultDto;

    }


    public static String getDate() {
        // diff 값 만큼 이전 날짜를 가져옴(0이면 오늘, 1이면 하루 전, 2면 이틀 전, 3이면 3일 전)
        ZoneId seoulZoneID = ZoneId.of("Asia/Seoul"); // 서울 표준 가져오기

        ZonedDateTime seoulTime = ZonedDateTime.now(seoulZoneID); // 서울 시간으로 지정
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return seoulTime.format(timeFormatter);
    }


}

