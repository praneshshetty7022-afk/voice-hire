package com.voicehire.repository;

import com.voicehire.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<String> findByWorkerId(String workerId);
    List<Application> findByEmployerId(String employerId);
    Optional<Application> findByJobIdAndWorkerId(String jobId, String workerId);
}
