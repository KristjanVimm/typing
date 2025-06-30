package com.kristjan.typing.controller;

import com.kristjan.typing.dto.CommonWordsDTO;
import com.kristjan.typing.dto.LessonDTO;
import com.kristjan.typing.dto.LessonPatchResponse;
import com.kristjan.typing.entity.Lesson;
import com.kristjan.typing.entity.LessonPage;
import com.kristjan.typing.entity.Person;
import com.kristjan.typing.entity.Preference;
import com.kristjan.typing.model.Book;
import com.kristjan.typing.model.NextPage;
import com.kristjan.typing.repository.LessonRepository;
import com.kristjan.typing.repository.PersonRepository;
import com.kristjan.typing.repository.PreferenceRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@RestController
public class LessonController {

    @Autowired
    LessonRepository lessonRepository;
    @Autowired
    PersonRepository personRepository;
    @Autowired
    PreferenceRepository preferenceRepository;

    @Value("${truncate-text-max-length}")
    int truncateTextMaxLength;

    @PostMapping("lesson")
    public Lesson createLesson(@RequestBody String lessonText) {
        // TODO add notification to frontend that longer string will be truncated
        // TODO add text purification for safety
        // TODO check if non-ascii characters work at all

        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        Person person = personRepository.findById(personId).orElseThrow();
//        String truncatedText = StringUtils.abbreviate(lessonText, truncateTextMaxLength);
        String cleanedText = lessonText.replaceAll("\\s+"," ").replaceAll("(\\s{2,})", " ");
        Lesson lesson = new Lesson(cleanedText, person);
        lessonRepository.save(lesson);
        Preference preference = preferenceRepository.findByPerson_Id(personId);
        preference.setCurrentLessonId(lesson.getId());
        preference.setWantCommonWords(false);
        preferenceRepository.save(preference);
        return lesson;
    }

    @PostMapping("random-words-lesson")
    public Lesson createRandomWordsLesson() {
        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        Person person = personRepository.findById(personId).orElseThrow();
//        String truncatedText = StringUtils.abbreviate(lessonText, truncateTextMaxLength);
        Lesson lesson = new Lesson("", person);
        lessonRepository.save(lesson);
        Preference preference = preferenceRepository.findByPerson_Id(personId);
        preference.setCurrentLessonId(lesson.getId());
        preference.setWantCommonWords(true);
        preferenceRepository.save(preference);
        return lesson;
    }

    @GetMapping("common-words")
    public ResponseEntity<CommonWordsDTO> getCommonWords(@RequestParam int numOfWords) throws IOException {
        Resource resource = new ClassPathResource("static/common-words.txt");
        try (InputStream inputStream = resource.getInputStream()) {
            String wordsText = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            List<String> wordsList = Arrays.asList(wordsText.split("\\s+"));
            Collections.shuffle(wordsList);
            String randomWordsText = String.join(" ", wordsList.subList(0, numOfWords));
            return ResponseEntity.ok(new CommonWordsDTO(" " + randomWordsText));
        }
    }

    @GetMapping("person-lessons")
    public List<Lesson> getPersonLessons() {
        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        return lessonRepository.findByPerson_IdAndTextNotOrderByIdAsc(personId);
    }

    // Gotten from Chat-GPT
    @GetMapping("books")
    public ResponseEntity<String> getBooks() throws IOException {
        // The path is relative to the classpath root.
        // Since books.json is in src/main/resources/static, use "static/books.json"
        Resource resource = new ClassPathResource("static/books.json");
        try (InputStream inputStream = resource.getInputStream()) {
            String json = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            return ResponseEntity.ok(json);
        }
    }

    @GetMapping("next-page")
    public NextPage getNextPage(@RequestParam Boolean isPreload) {
        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        Preference preference = preferenceRepository.findByPerson_Id(personId);
        Lesson lesson = lessonRepository.findById(preference.getCurrentLessonId()).orElseThrow();
        if (lesson.getText().isEmpty()) {
            return new NextPage("", false);
        }
        String lessonTextAfterBookmark = lesson.getText().substring(lesson.getBookmark());
        if (lessonTextAfterBookmark.isEmpty()) {
            return new NextPage("", true);
        }
        int indexOfNthWordAfterBookmark = getIndexOfNthWordAfterBookmark(lessonTextAfterBookmark, preference);
        if (isPreload) {
            String lessonTextAfterBookmarkPreload = lessonTextAfterBookmark.substring(indexOfNthWordAfterBookmark);
            int indexOfNthWordAfterBookmarkPreload = getIndexOfNthWordAfterBookmark(lessonTextAfterBookmarkPreload, preference);
            return new NextPage(lessonTextAfterBookmarkPreload.substring(0, indexOfNthWordAfterBookmarkPreload), false);
        }
        return new NextPage(lessonTextAfterBookmark.substring(0, indexOfNthWordAfterBookmark), false);
    }

    private static int getIndexOfNthWordAfterBookmark(String lessonTextAfterBookmark, Preference preference) {
        int indexOfNthWordAfterBookmark = StringUtils.ordinalIndexOf(
                lessonTextAfterBookmark,
                " ",
                preference.getWordsOnPage()+1);
        indexOfNthWordAfterBookmark = indexOfNthWordAfterBookmark == -1 ?
                lessonTextAfterBookmark.length() // - 1
                : indexOfNthWordAfterBookmark;
        return indexOfNthWordAfterBookmark;
    }

    @PatchMapping("lesson-bookmark")
    public void patchLessonBookmark(@RequestParam int bookmarkShift) {
        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        Preference preference = preferenceRepository.findByPerson_Id(personId);
        Lesson lesson = lessonRepository.findById(preference.getCurrentLessonId()).orElseThrow();
        lesson.setBookmark(lesson.getBookmark() + bookmarkShift);
        lessonRepository.save(lesson);
    }

    @PatchMapping("current-lesson")
    public LessonPatchResponse patchCurrentLesson(@RequestParam Long lessonId) {
        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        Preference preference = preferenceRepository.findByPerson_Id(personId);
        preference.setCurrentLessonId(lessonId);
        preference.setWantCommonWords(false);
        preferenceRepository.save(preference);
        return new LessonPatchResponse("OK");
    }
}
