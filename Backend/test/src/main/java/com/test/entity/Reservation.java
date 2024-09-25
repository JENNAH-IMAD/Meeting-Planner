package com.test.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

// Your other imports...
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private LocalDate dateMeeting;
    private LocalTime timeMeetingStart;
    private LocalTime timeMeetingEnd;
    private String createdBy;
    private String room;
    private String description;

    // Getters and setters

    public String getDateMeeting() {
        return dateMeeting.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")); // Return date as string in yyyy-MM-dd format
    }

    public void setDateMeeting(String dateMeeting) {
        this.dateMeeting = LocalDate.parse(dateMeeting, DateTimeFormatter.ofPattern("yyyy-MM-dd")); // Parse date string to LocalDate
    }

    public String getTimeMeetingStart() {
        return timeMeetingStart.format(DateTimeFormatter.ofPattern("HH:mm")); // Return time as string in HH:mm format
    }

    public void setTimeMeetingStart(String timeMeetingStart) {
        this.timeMeetingStart = LocalTime.parse(timeMeetingStart, DateTimeFormatter.ofPattern("HH:mm")); // Parse time string to LocalTime
    }

    public String getTimeMeetingEnd() {
        return timeMeetingEnd.format(DateTimeFormatter.ofPattern("HH:mm")); // Return time as string in HH:mm format
    }

    public void setTimeMeetingEnd(String timeMeetingEnd) {
        this.timeMeetingEnd = LocalTime.parse(timeMeetingEnd, DateTimeFormatter.ofPattern("HH:mm")); // Parse time string to LocalTime
    }
}
