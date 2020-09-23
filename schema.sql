CREATE TABLE todo
(
 id Integer NOT NULL,
  username varchar(11) NOT NULL ,
 description varchar(100) DEFAULT NULL,
 target_date  Date,
is_done Bool,
 PRIMARY KEY (id)
);