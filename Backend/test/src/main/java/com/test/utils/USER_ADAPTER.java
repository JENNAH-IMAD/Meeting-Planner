package com.test.utils;

import com.test.entity.Role;
import com.test.entity.User;
import com.test.request.UserDtoBody;

import java.util.Iterator;

public class USER_ADAPTER {

    public static UserDtoBody asUserDtoBody(User user){

        Iterator<Role> roleIterator = user.getRoles().iterator();
        Role current=new Role();
        if (roleIterator.hasNext()) {
             current = roleIterator.next();
        }
        return UserDtoBody.builder()
                .id(user.getId())
                .team(user.getTeam())
                .email(user.getEmail())
                .name(user.getName())
                .role(current.getName())
                .post(user.getPost())
                .password(null)
                .username(user.getUsername())
                .build();
    }
}
