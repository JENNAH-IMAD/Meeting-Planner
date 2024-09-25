package com.test.service.impl;
import com.test.dto.ReservationDto;
import com.test.entity.Reservation;
import com.test.repository.ReservationRepository;
import com.test.service.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import com.test.exception.ResourceNotFoundException;

import org.modelmapper.ModelMapper;


import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private ReservationRepository reservationRepository;
    private ModelMapper modelMapper;

    @Override
    public ReservationDto addReservation(ReservationDto reservationDto) {

        // convert ReservationDto into Reservation Jpa entity
        Reservation reservation = modelMapper.map(reservationDto, Reservation.class);

        // Reservation Jpa entity
        Reservation savedReservation = reservationRepository.save(reservation);

        // Convert saved Reservation Jpa entity object into ReservationDto object

        ReservationDto savedReservationDto = modelMapper.map(savedReservation, ReservationDto.class);

        return savedReservationDto;
    }

    @Override
    public ReservationDto getReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Reservation not found with id :"+ id));
        return modelMapper.map(reservation,ReservationDto.class);
    }
    @Override
    public List<ReservationDto> getAllReservations() {

        List<Reservation> reservations = reservationRepository.findAll();

        return reservations.stream().map((reservation) -> modelMapper.map(reservation, ReservationDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public ReservationDto updateReservation(ReservationDto reservationDto, Long id) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id : " + id));
        reservation.setTitle(reservationDto.getTitle());
        reservation.setDateMeeting(reservationDto.getDateMeeting());
        reservation.setTimeMeetingStart(reservationDto.getTimeMeetingStart());
        reservation.setTimeMeetingEnd(reservationDto.getTimeMeetingEnd());
        reservation.setCreatedBy(reservationDto.getCreatedBy());
        reservation.setDescription(reservationDto.getDescription());
        reservation.setRoom(reservationDto.getRoom());

        Reservation updatedReservation = reservationRepository.save(reservation);

        return modelMapper.map(updatedReservation, ReservationDto.class);
    }

    @Override
    public void deleteReservation(Long id) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id : " + id));

        reservationRepository.deleteById(id);
    }



}
