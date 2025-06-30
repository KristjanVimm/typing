package com.kristjan.typing.service;

import com.kristjan.typing.entity.LessonPage;
import com.kristjan.typing.entity.Statistics;
import com.kristjan.typing.repository.StatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class LessonPageService {

    @Autowired
    StatisticsRepository statisticsRepository;


    public void addLessonPageStatsToStatistics(LessonPage lessonPage, Long personId) {
        Statistics statistics = statisticsRepository.findByPerson_Id(personId);

        if (statistics.getNumWordsTyped() == null) {
            statistics.setNumWordsTyped(0);
        } if (statistics.getNumMillisecondsTyped() == null) {
            statistics.setNumMillisecondsTyped(0L);
        } if (statistics.getSpeed() == null) {
            statistics.setSpeed(0.0);
        } if (statistics.getNumCharactersTyped() == null) {
            statistics.setNumCharactersTyped(0L);
        } if (statistics.getNumMistakes() == null) {
            statistics.setNumMistakes(0L);
        } if (statistics.getAccuracy() == null) {
            statistics.setAccuracy(0.0);
        }

        List<String> pageWordsList = Arrays.asList(lessonPage.getBaseText().strip().split(" "));
        statistics.setNumWordsTyped(statistics.getNumWordsTyped() + pageWordsList.size());
        statistics.setNumMillisecondsTyped(statistics.getNumMillisecondsTyped() + lessonPage.getDuration());
        statistics.setSpeed(statistics.getNumWordsTyped() * 60.0 / (statistics.getNumMillisecondsTyped()/1000.0));

        statistics.setNumCharactersTyped(statistics.getNumCharactersTyped() + lessonPage.getTypedText().length());
        statistics.setNumMistakes(statistics.getNumMistakes() + lessonPage.getMistakes());
        statistics.setAccuracy((double) 100*(statistics.getNumCharactersTyped() - statistics.getNumMistakes()) / statistics.getNumCharactersTyped());
        statisticsRepository.save(statistics);
    }


//    public void addLessonPageStatsToStatistics(LessonPage lessonPage, Long personId) {
//        Statistics statistics = statisticsRepository.findByPerson_Id(personId);
//        HashMap<Character, Integer> mistakesMapDB = statistics.getMistakesMap();
//        HashMap<Character, Integer> mistakesMapLessonPage = lessonPage.getMistakesMap();
//        mistakesMapLessonPage.forEach((key, value) ->
//                mistakesMapDB.merge(key, value, Integer::sum)
//        );
//        statistics.setMistakesMap(mistakesMapDB);
//        HashMap<Character, Integer> correctsMapDB = statistics.getCorrectsMap();
//        HashMap<Character, Integer> correctsMapLessonPage = lessonPage.getCorrectsMap();
//        correctsMapLessonPage.forEach((key, value) ->
//                correctsMapDB.merge(key, value, Integer::sum)
//        );
//        statistics.setCorrectsMap(correctsMapDB);
//        statisticsRepository.save(statistics);
//    }

}
