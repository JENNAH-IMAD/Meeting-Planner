package com.test.controller;

import com.test.entity.User;
import com.test.request.UserDtoBody;

import com.test.request.UserDtoResponse;
import com.test.service.UserService;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin("*")
@RestController
@RequestMapping("api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    // Build Add User REST API

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UserDtoResponse> addUser(@RequestBody UserDtoBody userDto){

        UserDtoResponse savedUser = userService.addUser(userDto);

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }
    // Build Get User REST API
    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") Long userId){
        User user = userService.getUser(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    // Build Get All Users REST API
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ResponseEntity<List<UserDtoBody>> getAllUsers(){
        List<UserDtoBody> users = userService.getAllUsers();
        //return new ResponseEntity<>(users, HttpStatus.OK);
        return ResponseEntity.ok(users);
    }

    // Build Update User REST API
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("{id}")
    public ResponseEntity<UserDtoResponse> updateUser(@RequestBody UserDtoBody userDto, @PathVariable("id") Long userId){
        UserDtoResponse updatedUser = userService.updateUser(userDto, userId);
        return ResponseEntity.ok(updatedUser);
    }

    // Build Delete User REST API
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long userId){
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully!.");
    }


}
