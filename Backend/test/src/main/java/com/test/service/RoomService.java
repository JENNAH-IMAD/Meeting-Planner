package com.test.service;

import com.test.dto.RoomDto;


import java.util.List;

public interface RoomService {
    RoomDto addRoom(RoomDto roomDto);

    RoomDto getRoom(Long id);

    List<RoomDto> getAllRooms();

    RoomDto updateRoom(RoomDto roomDto, Long id);

    void deleteRoom(Long id);

}
