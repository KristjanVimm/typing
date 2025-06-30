package com.kristjan.typing.service;

import com.kristjan.typing.dto.PersonDTO;
import com.kristjan.typing.entity.Person;
import com.kristjan.typing.model.AuthToken;
import com.kristjan.typing.model.EmailPassword;
import com.kristjan.typing.repository.PersonRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PersonService {

    @Autowired
    PersonRepository personRepository;
    @Autowired
    ModelMapper modelMapper;

    String superSecretKey = "CSvBFpWxUDczNwL-vhYnOfVMW7bB3dfVJG_GhScFJRE";

    public AuthToken getToken(EmailPassword emailPassword) {
        Person person = personRepository.findByEmail(emailPassword.getEmail());
        if (person == null)
            throw new RuntimeException("ERROR_EMAIL_NOT_FOUND");
        if (!person.getPassword().equals(emailPassword.getPassword()))
            throw new RuntimeException("ERROR_WRONG_PASSWORD");
        AuthToken authToken = new AuthToken();
        Map<String, String> payload = new HashMap<>();
        payload.put("id", person.getId().toString());
        payload.put("email", person.getEmail());
        payload.put("role", person.getRole().toString());
        SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(superSecretKey));
        String token = Jwts
                .builder()
                .claims(payload)
                .signWith(secretKey)
                .compact();
        authToken.setToken(token);
        return authToken;
    }

    public List<PersonDTO> getPersonDTOs() {
        return List.of(modelMapper.map(personRepository.findAll(), PersonDTO[].class));
    }

}
