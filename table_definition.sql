create table book(
   bno char(8) ,
   category char(10),
   title varchar(40),
   press varchar(30),
   year int,
   author varchar(20),
   price decimal(7,2),
   total int,
   stock int,
   primary key(bno) 
);

create table manager(
    id char(8) primary key,
    name varchar(20),
    password varchar(20),
    phone varchar(13)
);

create table card(
    cno char (7),
    name varchar(10),
    department varchar(40),
    manager char(8),
    type enum('T', 'G', 'U', 'O'),
    primary key(cno),
    foreign key(manager)
    references manager(id)
    on update cascade
);

create table borrow(
    cno char(7),
    bno char(8),
    borrow_date datetime,
    return_date datetime,
    manager char(8),
    foreign key(manager)
    references manager(id),
    foreign key(cno)
    references card(cno)
    on delete cascade,
    foreign key(bno)
    references book(bno)
    on update cascade,
    foreign key(manager)
    references manager(id)
    on update cascade
);