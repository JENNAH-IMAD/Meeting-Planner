package com.test.service;


import com.test.dto.JwtAuthResponse;
import com.test.dto.LoginDto;
import com.test.dto.RegisterDto;

public interface AuthService {
    String register(RegisterDto registerDto);

    JwtAuthResponse login(LoginDto loginDto);
}
