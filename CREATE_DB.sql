CREATE TABLE IF NOT EXISTS devs (
    id INT(6) UNSIGNED AUTO_INCREMENT,
    name VARCHAR(30),
    birthday VARCHAR(10),
    available_hours_month INT(6),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS dev_formation (
    id INT(6) UNSIGNED AUTO_INCREMENT,
    dev_id INT(6) UNSIGNED,
    type VARCHAR(30),
    location VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS dev_work_history (
    id INT(6) UNSIGNED AUTO_INCREMENT,
    dev_id INT(6) UNSIGNED,
    enterprise VARCHAR(30),
    role VARCHAR(30),
    months INT(6),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS dev_competences (
    id INT(6) UNSIGNED AUTO_INCREMENT,
    dev_id INT(6) UNSIGNED,
    competence VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS dev_technologies (
    id INT(6) UNSIGNED AUTO_INCREMENT,
    dev_id INT(6) UNSIGNED,
    tecnologies VARCHAR(30),
    PRIMARY KEY(id)
);

ALTER TABLE dev_formation 
ADD CONSTRAINT FK_formation 
FOREIGN KEY (dev_id) REFERENCES devs(id) 
ON UPDATE CASCADE
ON DELETE CASCADE;


ALTER TABLE dev_work_history 
ADD CONSTRAINT FK_work_history
FOREIGN KEY (dev_id) REFERENCES devs(id) 
ON UPDATE CASCADE
ON DELETE CASCADE;


ALTER TABLE dev_competences
ADD CONSTRAINT FK_competences
FOREIGN KEY (dev_id) REFERENCES devs(id) 
ON UPDATE CASCADE
ON DELETE CASCADE;


ALTER TABLE dev_technologies
ADD CONSTRAINT FK_techonologies
FOREIGN KEY (dev_id) REFERENCES devs(id) 
ON UPDATE CASCADE
ON DELETE CASCADE;