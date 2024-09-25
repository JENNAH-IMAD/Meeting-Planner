package com.test.service.impl;

import com.test.request.UserDtoBody;
import com.test.entity.Role;
import com.test.entity.User;
import com.test.exception.ResourceNotFoundException;
import com.test.exception.TodoAPIException;
import com.test.repository.RoleRepository;
import com.test.repository.UserRepository;
import com.test.request.UserDtoResponse;
import com.test.service.UserService;
import com.test.utils.USER_ADAPTER;
import com.test.utils.VALUE_UTIL;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    private ModelMapper modelMapper;


    @Override
    public UserDtoResponse addUser(UserDtoBody userDto) {

        // check username is already exists in database
        if(userRepository.existsByUsername(userDto.getUsername())){
            throw new TodoAPIException(HttpStatus.BAD_REQUEST, VALUE_UTIL.USERNAME_EXIST);
        }

        // check email is already exists in database
        if(userRepository.existsByEmail(userDto.getEmail())){
            throw new TodoAPIException(HttpStatus.BAD_REQUEST, "Email is already exists!.");
        }

        User user = new User();
        user.setName(userDto.getName());
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setPost(userDto.getPost());
        user.setTeam(userDto.getTeam());
        user.setEmail(userDto.getEmail());

       Optional<Role> role = roleRepository.findByName(userDto.getRole());

        if(role.isPresent()){
            Set<Role> roles= new HashSet<>();
            roles.add(role.get());

            user.setRoles(roles);

            User updatedUser = userRepository.save(user);

            return UserDtoResponse.builder()
                    .user(updatedUser)
                    .message("User registred")
                    .build();
        }

        return UserDtoResponse.builder()
                .message("Role n'existe pas")
                .build();
    }

    @Override
    public User getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("User not found with id :"+ id));
        return user;
    }
    @Override
    public List<UserDtoBody> getAllUsers() {

        List<User> users = userRepository.findAll();

        return  users.stream()
                .map(USER_ADAPTER::asUserDtoBody)
                .collect(Collectors.toList());
    }


    @Override
    public UserDtoResponse updateUser(UserDtoBody UserDto, Long id)  {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id : " + id));
        user.setName(UserDto.getName());
        user.setUsername(UserDto.getUsername());
        user.setEmail(UserDto.getEmail());
       // user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setPost(UserDto.getPost());
        user.setTeam(UserDto.getTeam());

        Optional<Role> role = roleRepository.findByName(UserDto.getRole());

        if(role.isPresent()){
            Set<Role> roles= new HashSet<>();
            roles.add(role.get());

            user.setRoles(roles);

            User updatedUser = userRepository.save(user);

            return UserDtoResponse.builder()
                    .user(updatedUser)
                    .message("User updateed")
                    .build();
        }

        return UserDtoResponse.builder()
                .message("Role n'existe pas")
                .build();
    }


    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id : " + id));

        userRepository.deleteById(id);
    }

}
