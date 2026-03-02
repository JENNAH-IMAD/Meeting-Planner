package com.test.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDtoBody {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String password;
    private String post;
    private String team;
    private String role;

}
