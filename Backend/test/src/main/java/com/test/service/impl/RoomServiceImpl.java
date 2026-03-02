package com.test.service.impl;



import com.test.dto.RoomDto;

import com.test.entity.Room;

import com.test.exception.ResourceNotFoundException;
import com.test.repository.RoomRepository;
import com.test.service.RoomService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RoomServiceImpl implements RoomService {
    
    private RoomRepository roomRepository;
    private ModelMapper modelMapper;

    @Override
    public RoomDto addRoom(RoomDto roomDto) {

        // convert RoomDto into Room Jpa entity
        Room room = modelMapper.map(roomDto, Room.class);

        // Room Jpa entity
        Room savedRoom = roomRepository.save(room);

        // Convert saved Room Jpa entity object into RoomDto object

        RoomDto savedRoomDto = modelMapper.map(savedRoom, RoomDto.class);

        return savedRoomDto;
    }

    @Override
    public RoomDto getRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Room not found with id :"+ id));
                return modelMapper.map(room,RoomDto.class);
    }
    @Override
    public List<RoomDto> getAllRooms() {

        List<Room> rooms = roomRepository.findAll();

        return rooms.stream().map((room) -> modelMapper.map(room, RoomDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public RoomDto updateRoom(RoomDto roomDto, Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id : " + id));
        room.setName(roomDto.getName());
        room.setTypeofRoom(roomDto.getTypeofRoom());
        room.setCapacity(roomDto.getCapacity());

        Room updatedRoom = roomRepository.save(room);

        return modelMapper.map(updatedRoom, RoomDto.class);
    }

    @Override
    public void deleteRoom(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id : " + id));

        roomRepository.deleteById(id);
    }




}
