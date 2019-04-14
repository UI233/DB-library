create table book(
   bno char(8) primary key,
   category char(10),
   title varchar(40),
   press varchar(30),
   year int,
   author varchar(20),
   price decimal(7,2),
   total int,
   stock int
);

create table manager(
    id char(8) primary key,
    name varchar(20),
    password varchar(20) not null,
    phone varchar(13)
);

create table card(
    cno char (7) primary key,
    name varchar(10),
    department varchar(40),
    type enum('student','teacher')
);

create table borrow(
    cno char(7),
    bno char(8),
    borrow_date datetime not null,
    return_date datetime,
    manager char(8),
    foreign key(manager)
    references manager(id),
    foreign key(cno) references card(cno) on delete cascade,
    foreign key(bno)  references book(bno),
    foreign key(manager)references manager(id)
);


/*data for manager*/
INSERT INTO MANAGER VALUES ('001','HTT','Yoooo','123123123');

/*data for card*/
INSERT INTO card VALUES ('01','HTT','计院','student');
INSERT INTO card VALUES ('02','WLX','信电','student');
INSERT INTO card VALUES ('03','CY','计院','teacher');
INSERT INTO card VALUES ('04','HGS','计院','student');

/*data for book*/
INSERT INTO BOOK VALUES('19','传记','乔布斯传','中信出版社','2014','Walter Isaacson','68','8','8');
INSERT INTO BOOK VALUES('16','传记','乔布斯传','中信出版社','2014','Walter Isaacson','68','6','6');

/*data for borrow*/
INSERT INTO BORROW VALUES('01','20',NOW(),NULL,'001');


DELIMITER ||
CREATE TRIGGER borrowCheck after INSERT ON borrow
FOR EACH ROW
BEGIN
DECLARE NUM INT;
DECLARE MSGS VARCHAR(60);
DECLARE TYPE enum('student','teacher');
SET NUM=(SELECT COUNT(CNO) FROM BORROW WHERE CNO=NEW.CNO);
/*这边没有起作用 不知道为什么 随后痛快地对老师和学生一视同仁:) 可能是判断的问题。*/
IF NUM>5 THEN
    SELECT 'The number of book you borrow has a limit.' into @msgs;
    delete from borrow where cno=new.cno and borrow_date=new.borrow_date;
ELSE
    /*卡号和书号可利用外键约束直接判断，借书记录条数需要靠触发器进行判断，不成功，删除记录；成功，库存更新，*/
    /*此时又涉及库存够不够的问题*/
    SET NUM = (select STOCK FROM BOOK WHERE BNO=NEW.BNO);
    IF NUM>=1 
    THEN
        update  book set stock=stock-1 WHERE BNO=NEW.BNO ;
    ELSE 
        delete from borrow where cno=new.cno and borrow_date=new.borrow_date;
    END IF;
end if;
END||
DELIMITER ;



DELIMITER ||
/*还书就是更新时的触发器把对应的库存+1*/
CREATE TRIGGER returnCheck after UPDATE ON borrow
FOR EACH ROW
BEGIN
if old.return_date is NULL and new.return_date is not null
THEN
    update book set stock=stock+1 WHERE BNO=old.BNO ;
END IF;
END||
DELIMITER ;


/*如果学生读书卡被删除，然后他有未归还的书就把那个书的总藏书量-1库存不变，然后把和他相关的归还记录删除。*/
/*归还记录可利用级联删除，但是得在删除前把总藏书量-1.*/
DELIMITER ||
CREATE TRIGGER deleteCard before DELETE ON CARD
FOR EACH ROW
BEGIN
    UPDATE  BOOK SET TOTAL=TOTAL-1 WHERE BNO IN (SELECT BNO FROM BORROW WHERE CNO=OLD.CNO AND return_date IS NULL);
END||
DELIMITER ;
