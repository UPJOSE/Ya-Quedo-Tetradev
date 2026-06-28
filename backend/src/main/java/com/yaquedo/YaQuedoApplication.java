package com.yaquedo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class YaQuedoApplication {

    public static void main(String[] args) {
        SpringApplication.run(YaQuedoApplication.class, args);
    }
}
