DROP schema if exists testdb_spring;
create schema testdb_spring;

USE testdb_spring;
INSERT INTO roles(name) VALUES('ROLE_USER');
INSERT INTO roles(name) VALUES('ROLE_MODERATOR');
INSERT INTO roles(name) VALUES('ROLE_ADMIN');