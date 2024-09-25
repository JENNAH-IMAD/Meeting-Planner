package com.test.service;

import com.test.dto.ReservationDto;


import java.util.List;

public interface ReservationService {
    ReservationDto addReservation(ReservationDto reservationDto);

    ReservationDto getReservation(Long id);

    List<ReservationDto> getAllReservations();

    ReservationDto updateReservation(ReservationDto reservationDto, Long id);

    void deleteReservation(Long id);
}
