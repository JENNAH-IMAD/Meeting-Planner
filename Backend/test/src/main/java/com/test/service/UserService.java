package com.test.service;

import com.test.entity.User;
import com.test.request.UserDtoBody;
import com.test.request.UserDtoResponse;

import java.util.List;

public interface UserService {
    UserDtoResponse addUser(UserDtoBody UserDto);


    User getUser(Long id);

    List<UserDtoBody> getAllUsers();

    UserDtoResponse updateUser(UserDtoBody UserDto, Long id);

    void deleteUser(Long id);


 
}
