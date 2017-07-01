DROP TABLE IF EXISTS dev_technologies;
DROP TABLE IF EXISTS dev_competences;
DROP TABLE IF EXISTS devs;

CREATE TABLE IF NOT EXISTS devs (
    id BIGSERIAL NOT NULL,
    name VARCHAR(30),
    birthday VARCHAR(10),
    available_hours_month INT,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS dev_competences (
    id BIGSERIAL NOT NULL,
    dev_id INT,
    competence VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS dev_technologies (
    id BIGSERIAL NOT NULL,
    dev_id INT,
    technology VARCHAR(30),
    PRIMARY KEY(id)
);

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

INSERT INTO devs (name, birthday, available_hours_month) VALUES ('Fred Laranjo', '24/03/1992', 30) RETURNING id;
INSERT INTO dev_competences (dev_id, competence) VALUES ( 1, 'Team Leadership') , ( 1, 'Development'), ( 1, 'Architecture'), ( 1, 'DevOps');
INSERT INTO dev_technologies (dev_id, technology) VALUES ( 1, 'Java') , ( 1, 'C#') , ( 1, 'JavaScript') , ( 1, 'C') , ( 1, 'C++') , ( 1, 'HTML5') , ( 1, 'CSS3');
INSERT INTO devs (name, birthday, available_hours_month) VALUES ('John Doe', '01/01/1800', 40) RETURNING id;
INSERT INTO dev_competences (dev_id, competence) VALUES ( 2, 'Team Leadership') , ( 2, 'Development');
INSERT INTO dev_technologies (dev_id, technology) VALUES ( 2, 'NodeJS') , ( 2, 'JavaScript'), ( 1, 'HTML5') , ( 1, 'CSS3');
SELECT * from devs d;
SELECT dc.* from devs d JOIN dev_competences dc ON dc.dev_id = d.id ORDER BY dc.dev_id, dc.id;
SELECT dt.* from devs d JOIN dev_technologies dt ON dt.dev_id = d.id ORDER BY dt.dev_id, dt.id;

SELECT * from devs d WHERE d.id = 1;
SELECT dc.* from devs d JOIN dev_competences dc ON dc.dev_id = d.id WHERE d.id = 1 ORDER BY dc.dev_id, dc.id;
SELECT dt.* from devs d JOIN dev_technologies dt ON dt.dev_id = d.id WHERE d.id = 1 ORDER BY dt.dev_id, dt.id;

((SELECT d.*, dc.*,'C' as grouped  from devs d JOIN dev_competences dc ON dc.dev_id = d.id WHERE d.id = 1 ORDER BY dc.dev_id, dc.id)
UNION
(SELECT d.*, dt.*,'T' as grouped from devs d JOIN dev_technologies dt ON dt.dev_id = d.id WHERE d.id = 1 ORDER BY dt.dev_id, dt.id)
 ) order by grouped;