package com.tusur.lab.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "usr", uniqueConstraints =
                {
                        @UniqueConstraint(columnNames = "id"),
                        @UniqueConstraint(columnNames = "login")
                })
public class User {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private Long id;
    private String login;
    @JsonIgnore
    private String password;
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
}
