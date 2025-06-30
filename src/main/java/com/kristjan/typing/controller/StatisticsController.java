package com.kristjan.typing.controller;

import com.kristjan.typing.entity.Statistics;
import com.kristjan.typing.repository.StatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatisticsController {

    @Autowired
    StatisticsRepository statisticsRepository;

    @GetMapping("statistics")
    public Statistics getStatistics() {
        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        return statisticsRepository.findByPerson_Id(personId);
    }

}
