package com.test.controller;



import com.test.dto.RoomDto;
import lombok.AllArgsConstructor;

import com.test.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/rooms")
@AllArgsConstructor
public class RoomController {

    private RoomService roomService;

    // Build Add Room REST API

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<RoomDto> addRoom(@RequestBody RoomDto roomDto){

        RoomDto savedRoom = roomService.addRoom(roomDto);

        return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
    }
    // Build Get Room REST API
    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("{id}")
    public ResponseEntity<RoomDto> getRoom(@PathVariable("id") Long roomId){
        RoomDto roomDto = roomService.getRoom(roomId);
        return new ResponseEntity<>(roomDto, HttpStatus.OK);
    }
    // Build Get All Rooms REST API
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ResponseEntity<List<RoomDto>> getAllRooms(){
        List<RoomDto> rooms = roomService.getAllRooms();
        //return new ResponseEntity<>(rooms, HttpStatus.OK);
        return ResponseEntity.ok(rooms);
    }

    // Build Update Room REST API
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("{id}")
    public ResponseEntity<RoomDto> updateRoom(@RequestBody RoomDto roomDto, @PathVariable("id") Long roomId){
        RoomDto updatedRoom = roomService.updateRoom(roomDto, roomId);
        return ResponseEntity.ok(updatedRoom);
    }

    // Build Delete Room REST API
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable("id") Long roomId){
        roomService.deleteRoom(roomId);
        return ResponseEntity.ok("Room deleted successfully!.");
    }


}
