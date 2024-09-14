create database db_surveys;

CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NULL,
    googleId NVARCHAR(255) NULL,
);


CREATE TABLE surveys(
id INT PRIMARY KEY IDENTITY(1,1),
title NVARCHAR(250) NOT NULL, 
description NVARCHAR(MAX) NULL,
created_user_id INT NOT NULL,
createAt DATETIME DEFAULT GETDATE(),
updateAt DATETIME DEFAULT GETDATE(),
FOREIGN KEY(created_user_id) REFERENCES users(id)
);

CREATE TABLE questions(
id INT PRIMARY KEY IDENTITY(1,1),
survey_id INT NOT NULL, 
question_text NVARCHAR(MAX) NOT NULL,
question_type NVARCHAR(50) NOT NULL,
isRequired BIT NOT NULL DEFAULT 0,
FOREIGN KEY (survey_id) REFERENCES surveys(id)
);

CREATE TABLE questions_options(
id INT PRIMARY KEY IDENTITY(1,1),
question_id INT NOT NULL,
option_text NVARCHAR(MAX) NOT NULL,
FOREIGN KEY (question_id) REFERENCES questions(id)
);


CREATE TABLE answers (
    id INT PRIMARY KEY IDENTITY(1,1),
    id_survey INT NOT NULL,
    modified_user_id INT NOT NULL, 
    response_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_survey) REFERENCES surveys(id),
    FOREIGN KEY (modified_user_id) REFERENCES users(id)
);

CREATE TABLE answers_detail(
id INT PRIMARY KEY IDENTITY(1,1),
answers_id INT NOT NULL,
id_question INT NOT NULL,
question_option_id INT NULL,
text_answer NVARCHAR(MAX) NULL,
FOREIGN KEY(answers_id) REFERENCES answers(id),
FOREIGN KEY(id_question) REFERENCES questions(id),
FOREIGN KEY(question_option_id) REFERENCES questions_options(id),
);