package com.ryan.docu.mapper;

import com.ryan.docu.model.User;
import com.ryan.docu.model.dto.UserCreateDTO;
import com.ryan.docu.model.dto.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {
            DocumentMapper.class,
        })
public interface UserMapper {

    UserDTO toDTO(User user);

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "documents", ignore = true)
    User fromCreateDTO(UserCreateDTO userCreateDTO);
}
