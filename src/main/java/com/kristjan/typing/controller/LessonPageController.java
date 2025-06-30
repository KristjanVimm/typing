package com.kristjan.typing.controller;

import com.kristjan.typing.entity.Lesson;
import com.kristjan.typing.entity.LessonPage;
import com.kristjan.typing.entity.Preference;
import com.kristjan.typing.repository.LessonPageRepository;
import com.kristjan.typing.repository.LessonRepository;
import com.kristjan.typing.repository.PreferenceRepository;
import com.kristjan.typing.service.LessonPageService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Log4j2
@RestController
public class LessonPageController {

    @Autowired
    LessonPageRepository lessonPageRepository;
    @Autowired
    PreferenceRepository preferenceRepository;
    @Autowired
    LessonRepository lessonRepository;
    @Autowired
    LessonPageService lessonPageService;


    @PostMapping("lesson-page")
    public LessonPage saveLessonPage(
            @RequestBody LessonPage lessonPage,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {
        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        Preference preference = preferenceRepository.findByPerson_Id(personId);
        Lesson lesson = lessonRepository.findById(preference.getCurrentLessonId()).orElseThrow();
        lessonPage.setLesson(lesson);
//        for (Character character: lessonPage.getCorrectsMap().keySet()) {
//            log.info(character + ": " + lessonPage.getCorrectsMap().get(character));
//        }
//        for (Character character: lessonPage.getMistakesMap().keySet()) {
//            log.info(character + ": " + lessonPage.getMistakesMap().get(character));
//        }
//        lessonPageService.addLessonPageStatsToStatistics(lessonPage, personId);
        lessonPageService.addLessonPageStatsToStatistics(lessonPage, personId);
        return lessonPageRepository.save(lessonPage);
    }

    @GetMapping("current-lesson-pages")
    public List<LessonPage> getLessonPages() {
        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        Preference preference = preferenceRepository.findByPerson_Id(personId);
        if (preference.getCurrentLessonId() == null) {
            log.info("currentLessonId is null, returning empty List");
            return new ArrayList<>();
        }
        log.info("returning response from findByLesson_IdOrderByIdAsc()");
        log.info("currentLessonId: " + preference.getCurrentLessonId());
        return lessonPageRepository.findByLesson_IdOrderByIdAsc(preference.getCurrentLessonId());
    }
}
