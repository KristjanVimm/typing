package com.kristjan.typing.repository;

import com.kristjan.typing.entity.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatisticsRepository extends JpaRepository<Statistics, Long> {

    Statistics findByPerson_Id(Long id);
}
