package me.programmerdmd.discordfeeds.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.NOT_FOUND, reason = "The JobDetail wasn't found!")
public class JobDetailNotFoundException extends RuntimeException {

}