package com.test.controller;

import com.test.dto.ReservationDto;
import com.test.service.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("*")
@RestController
@RequestMapping("api/reservations")
@AllArgsConstructor

public class ReservationController {
    private ReservationService reservationService;

    // Build Add Reservation REST API

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PostMapping
    public ResponseEntity<ReservationDto> addReservation(@RequestBody ReservationDto reservationDto){

        ReservationDto savedReservation = reservationService.addReservation(reservationDto);

        return new ResponseEntity<>(savedReservation, HttpStatus.CREATED);
    }
    // Build Get Reservation REST API
    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("{id}")
    public ResponseEntity<ReservationDto> getReservation(@PathVariable("id") Long reservationId){
        ReservationDto reservationDto = reservationService.getReservation(reservationId);
        return new ResponseEntity<>(reservationDto, HttpStatus.OK);
    }
    // Build Get All Reservations REST API
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ResponseEntity<List<ReservationDto>> getAllReservations(){
        List<ReservationDto> reservations = reservationService.getAllReservations();
        //return new ResponseEntity<>(reservations, HttpStatus.OK);
        return ResponseEntity.ok(reservations);
    }

    // Build Update Reservation REST API
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("{id}")
    public ResponseEntity<ReservationDto> updateReservation(@RequestBody ReservationDto reservationDto, @PathVariable("id") Long reservationId){
        ReservationDto updatedReservation = reservationService.updateReservation(reservationDto, reservationId);
        return ResponseEntity.ok(updatedReservation);
    }

    // Build Delete Reservation REST API
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable("id") Long reservationId){
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.ok("Reservation deleted successfully!.");
    }
}
