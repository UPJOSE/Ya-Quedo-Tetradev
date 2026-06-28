package com.yaquedo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateDto {

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must be less than 100 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must be less than 100 characters")
    private String lastName;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{9}$", message = "Phone must have 9 digits")
    private String phone;

    @Size(max = 255, message = "Address must be less than 255 characters")
    private String address;

    @Size(max = 1000, message = "Biography must be less than 1000 characters")
    private String biography;

    private Long districtId;

    @Size(max = 50, message = "Payment method must be less than 50 characters")
    private String preferredPaymentMethod;
}
