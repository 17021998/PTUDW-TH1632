CREATE DATABASE TH16NEWS CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE Post
(
	ID int AUTO_INCREMENT,
	Premium int not null,
	PostStatus int,
	Title varchar(50),
	Content TEXT,
	Abstract TEXT,
	ReleaseDay date,
	Primary key(ID)
)

CREATE TABLE UserPrimary
(
	ID varchar(50),
	ProviderCo varchar(50) null,
	FullName varchar(50),
	Email varchar(50),
	Photo varchar(50),
	DoB date,
	PassHash varchar(50),
	Primary key(ID)
)


create table Catagory
(
	ID int AUTO_INCREMENT,
	CatName varchar(50),
	SuperCatID int null,
	Primary key(ID)
)


create table Tag
(
	ID int AUTO_INCREMENT,
	TagName varchar(50),
	Primary key(ID)
)


create table CatPost
(
	CatID int,
	PostID int,
	Primary key(CatID, PostID)
)

create table TagPost
(
	TagID int,
	PostID int,
	Primary key(TagID, PostID)
)

create table Subscriber
(
	UserID varchar(50),
	Status int,
	BeginDay date,
	Primary key(UserID)
)

create table Writer
(
	UserID varchar(50),
	WriterName varchar(50),
	Primary key(UserID)
)

create table WriterPost
(
	WriterID varchar(50),
	PostID int,
	Primary key(WriterID, PostID)
)

create table Editor
(
	UserID varchar(50),
	Primary key(UserID)
)

create table EditorCat
(
	UserID varchar(50),
	ManagedCatID int,
	Primary key(UserID, ManagedCatID)
)

--FK's Table CatPost
ALTER CatPost
ADD FOREIGN KEY fk_CatPost_Cat(CatID) 
REFERENCES Catagory(ID) ON DELETE action ON UPDATE action;

ALTER CatPost
ADD FOREIGN KEY fk_CatPost_Post(PostID) 
REFERENCES Post(ID) ON DELETE action ON UPDATE action;

--FK's Table TagPost
ALTER TagPost
ADD FOREIGN KEY fk_TagPost_Post(PostID) 
REFERENCES Post(ID) ON DELETE action ON UPDATE action;

ALTER TagPost
ADD FOREIGN KEY fk_TagPost_Tag(TagID) 
REFERENCES Tag(ID) ON DELETE action ON UPDATE action;

--FK's Table Subscriber
ALTER Subscriber
ADD FOREIGN KEY fk_Subscriber_User(UserID) 
REFERENCES UserPrimary(ID) ON DELETE action ON UPDATE action;

--FK's Writer
ALTER Writer
ADD FOREIGN KEY fk_Writer_User(UserID) 
REFERENCES UserPrimary(ID) ON DELETE action ON UPDATE action;

ALTER WriterPost
ADD FOREIGN KEY fk_WriterPost_Post(PostID) 
REFERENCES Post(ID) ON DELETE action ON UPDATE action;

ALTER WriterPost
ADD FOREIGN KEY fk_WriterPost_Writer(WriterID) 
REFERENCES Writer(UserID) ON DELETE action ON UPDATE action;
--FK's Editor
ALTER Editor
ADD FOREIGN KEY fk_Editor_User(UserID) 
REFERENCES UserPrimary(ID) ON DELETE action ON UPDATE action;

ALTER EditorCat
ADD FOREIGN KEY fk_Editor_Cat(ManagedCatID) 
REFERENCES Catagory(ID) ON DELETE action ON UPDATE action;

ALTER Editor
ADD FOREIGN KEY fk_EditorCat_Editor(UserID) 
REFERENCES Editor(UserID) ON DELETE action ON UPDATE action;