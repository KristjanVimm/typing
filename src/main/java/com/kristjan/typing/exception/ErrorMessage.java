package com.kristjan.typing.exception;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
public class ErrorMessage {

    private Date timestamp;
    private int status;
    private String error;

}
