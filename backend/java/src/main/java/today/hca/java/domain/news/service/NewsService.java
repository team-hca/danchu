package today.hca.java.domain.news.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import today.hca.java.domain.news.entity.News;
import today.hca.java.domain.news.repository.NewsRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;

    public News getQuizByDate(String date) {
        List<News> list = newsRepository.findAll();
        for(News q: list) {
            System.out.println(q.toString());
        }
        return newsRepository.findQuizByDate(date);
    }
}
