package com.ryan.docu.service;

import com.ryan.docu.mapper.UserMapper;
import com.ryan.docu.model.User;
import com.ryan.docu.model.dto.UserCreateDTO;
import com.ryan.docu.model.dto.UserDTO;
import com.ryan.docu.repo.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final UserMapper userMapper;

    public User createUser(UserCreateDTO userCreateDTO) {
        return userRepo.save(userMapper.toEntity(userCreateDTO));
    }

    public void save(User user) {
        userRepo.save(user);
    }

    public UserDTO getUserById(UUID id) {
        return userMapper.toDTO(userRepo.findById(id).orElse(null));
    }

    public List<UserDTO> getAllUsers() {
        return userRepo.findAll().stream().map(userMapper::toDTO).collect(Collectors.toList());
    }

    public void deleteUser(UUID id) {
        userRepo.deleteById(id);
    }

    // Helper method for Document Service class functions
    public User findEntityById(UUID id) {
        return userRepo.findById(id).orElse(null);
    }
}
