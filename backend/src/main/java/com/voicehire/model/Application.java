package com.voicehire.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "applications")
public class Application {

    @Id
    private String id;
    private String applicationId;
    private String jobId;
    private String workerId;
    private String workerName;
    private String workerPhone;
    private String employerId;
    private String employerName;
    private String jobTitle;
    private String jobLocation;
    private String category;
    private Integer minSalary;
    private Integer maxSalary;
    private String salaryType;
    private String experience;
    private String voiceRecording;
    private String voiceTranscript;
    private String applicationSource;
    private String status; // APPLIED, UNDER_REVIEW, INTERVIEW_SCHEDULED, HIRED, REJECTED
    private Long appliedAt;
    private Long updatedAt;
    
    // Interview details
    private String interviewDate;
    private String interviewTime;
    private String interviewMode;
    private String interviewLocation;
    private String employerMessage;

    public Application() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getApplicationId() { return applicationId; }
    public void setApplicationId(String applicationId) { this.applicationId = applicationId; }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public String getWorkerId() { return workerId; }
    public void setWorkerId(String workerId) { this.workerId = workerId; }

    public String getWorkerName() { return workerName; }
    public void setWorkerName(String workerName) { this.workerName = workerName; }

    public String getWorkerPhone() { return workerPhone; }
    public void setWorkerPhone(String workerPhone) { this.workerPhone = workerPhone; }

    public String getEmployerId() { return employerId; }
    public void setEmployerId(String employerId) { this.employerId = employerId; }

    public String getEmployerName() { return employerName; }
    public void setEmployerName(String employerName) { this.employerName = employerName; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getJobLocation() { return jobLocation; }
    public void setJobLocation(String jobLocation) { this.jobLocation = jobLocation; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getMinSalary() { return minSalary; }
    public void setMinSalary(Integer minSalary) { this.minSalary = minSalary; }

    public Integer getMaxSalary() { return maxSalary; }
    public void setMaxSalary(Integer maxSalary) { this.maxSalary = maxSalary; }

    public String getSalaryType() { return salaryType; }
    public void setSalaryType(String salaryType) { this.salaryType = salaryType; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getVoiceRecording() { return voiceRecording; }
    public void setVoiceRecording(String voiceRecording) { this.voiceRecording = voiceRecording; }

    public String getVoiceTranscript() { return voiceTranscript; }
    public void setVoiceTranscript(String voiceTranscript) { this.voiceTranscript = voiceTranscript; }

    public String getApplicationSource() { return applicationSource; }
    public void setApplicationSource(String applicationSource) { this.applicationSource = applicationSource; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getAppliedAt() { return appliedAt; }
    public void setAppliedAt(Long appliedAt) { this.appliedAt = appliedAt; }

    public Long getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Long updatedAt) { this.updatedAt = updatedAt; }

    public String getInterviewDate() { return interviewDate; }
    public void setInterviewDate(String interviewDate) { this.interviewDate = interviewDate; }

    public String getInterviewTime() { return interviewTime; }
    public void setInterviewTime(String interviewTime) { this.interviewTime = interviewTime; }

    public String getInterviewMode() { return interviewMode; }
    public void setInterviewMode(String interviewMode) { this.interviewMode = interviewMode; }

    public String getInterviewLocation() { return interviewLocation; }
    public void setInterviewLocation(String interviewLocation) { this.interviewLocation = interviewLocation; }

    public String getEmployerMessage() { return employerMessage; }
    public void setEmployerMessage(String employerMessage) { this.employerMessage = employerMessage; }
}
