CREATE DATABASE TH16NEWS CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE Post
(
	PostID int AUTO_INCREMENT,
	Premium int not null,
	PostStatus int,
	Title varchar(50),
	Content TEXT,
	Abstract TEXT,
	ReleaseDay date
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
	PassHash varchar(50)
	Primary key(ID)
)


create table Catagory
(
	ID int, --autoincreate number
	CatName varchar(50),
	SuperCatID int null --Nếu là chuyên mục con
	Primary key(ID)
)


create table Tag
(
	ID int,
	TagName varchar(50)
	Primary key(ID)
)


create table CatPost
(
	CatID int,
	PostID int
	Primary key(CatID, PostID)
)

create table TagPost
(
	TagID int,
	PostID int
	Primary key(TagID, PostID)
)

create table Subscriber
(
	UserID varchar(50),
	Statuss int,
	BeginDay date
	Primary key(UserID)
)

create table Writer
(
	UserID varchar(50),
	WriterName varchar(50)
	Primary key(UserID)
)

create table WriterPost
(
	WriterID varchar(50),
	PostID int
	Primary key(WriterID, PostID)
)

create table Editor
(
	UserID varchar(50) Primary key
)

create table EditorCat
(
	UserID varchar(50),
	ManagedCatID int
	Primary key(UserID, ManagedCatID)
)

ALTER TABLE
SET FOREIGN KEY() REFERENCES 
