-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 04, 2019 at 04:24 PM
-- Server version: 10.1.39-MariaDB
-- PHP Version: 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
CREATE DATABASE IF NOT EXISTS `th16news` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `th16news`;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CatName` varchar(50) DEFAULT NULL,
  `SuperCatID` int(11) DEFAULT NULL,
  `IsDelete` int(1) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_cat_cat` (`SuperCatID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `category`:
--   `SuperCatID`
--       `category` -> `ID`
--

-- --------------------------------------------------------

--
-- Table structure for table `catpost`
--

DROP TABLE IF EXISTS `catpost`;
CREATE TABLE IF NOT EXISTS `catpost` (
  `CatID` int(11) NOT NULL,
  `PostID` int(11) NOT NULL,
  PRIMARY KEY (`CatID`,`PostID`),
  KEY `fk_CatPost_Post` (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `catpost`:
--   `CatID`
--       `category` -> `ID`
--   `PostID`
--       `post` -> `ID`
--

--
-- Table structure for table `editorcat`
--

DROP TABLE IF EXISTS `editorcat`;
CREATE TABLE IF NOT EXISTS `editorcat` (
  `UserID` varchar(50) NOT NULL,
  `ManagedCatID` int(11) NOT NULL,
  PRIMARY KEY (`UserID`,`ManagedCatID`),
  KEY `fk_editcat_cat` (`ManagedCatID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `editorcat`:
--   `ManagedCatID`
--       `category` -> `ID`
--   `UserID`
--       `editor` -> `UserID`
--

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE IF NOT EXISTS `post` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Premium` int(11) DEFAULT NULL,
  `PostStatus` int(11) DEFAULT NULL,
  `Title` varchar(50) DEFAULT NULL,
  `Content` text,
  `Abstract` text,
  `ImageAbstract` text,
  `ReleaseDay` date DEFAULT NULL,
  `Deny` text DEFAULT NULL,
  `Viewed` int DEFAULT 0,
  `EditorID` varchar(50) DEFAULT NULL,
  `IsDelete` int(1) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `post`:
--

-- --------------------------------------------------------

--
-- Table structure for table `subscriber`
--

DROP TABLE IF EXISTS `subscriber`;
CREATE TABLE IF NOT EXISTS `subscriber` (
  `UserID` varchar(50) NOT NULL,
  `Status` int(11) DEFAULT NULL,
  `BeginDay` date DEFAULT NULL,
  `EndDay` date DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `subscriber`:
--   `UserID`
--       `userprimary` -> `ID`
--

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
CREATE TABLE IF NOT EXISTS `tag` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TagName` varchar(50) DEFAULT NULL,
  `IsDelete` int(1) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `tag`:
--

-- --------------------------------------------------------

--
-- Table structure for table `tagpost`
--

DROP TABLE IF EXISTS `tagpost`;
CREATE TABLE IF NOT EXISTS `tagpost` (
  `TagID` int(11) NOT NULL,
  `PostID` int(11) NOT NULL,
  PRIMARY KEY (`TagID`,`PostID`),
  KEY `fk_tagpost_post` (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `tagpost`:
--   `PostID`
--       `post` -> `ID`
--   `TagID`
--       `tag` -> `ID`
--

-- --------------------------------------------------------

--
-- Table structure for table `userprimary`
--

DROP TABLE IF EXISTS `userprimary`;
CREATE TABLE IF NOT EXISTS `userprimary` (
  `ID` varchar(50) NOT NULL,
  `ProviderCo` varchar(50) DEFAULT NULL,
  `FullName` varchar(50) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Photo` varchar(100) DEFAULT NULL,
  `DoB` date DEFAULT NULL,
  `PassHash` varchar(100) DEFAULT NULL,
  `role` varchar(15) DEFAULT NULL,
  `IsDelete` int(1) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `userprimary`:
--

-- --------------------------------------------------------

--
-- Table structure for table `writer`
--

DROP TABLE IF EXISTS `writer`;
CREATE TABLE IF NOT EXISTS `writer` (
  `UserID` varchar(50) NOT NULL,
  `WriterName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `writer`:
--   `UserID`
--       `userprimary` -> `ID`
--

-- --------------------------------------------------------

--
-- Table structure for table `writerpost`
--

DROP TABLE IF EXISTS `writerpost`;
CREATE TABLE IF NOT EXISTS `writerpost` (
  `WriterID` varchar(50) NOT NULL,
  `PostID` int(11) NOT NULL,
  PRIMARY KEY (`WriterID`,`PostID`),
  KEY `fk_writerp_post` (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONSHIPS FOR TABLE `writerpost`:
--   `PostID`
--       `post` -> `ID`
--   `WriterID`
--       `writer` -> `UserID`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `post`
--
ALTER TABLE `post` ADD FULLTEXT KEY `Title` (`Title`,`Content`,`Abstract`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `fk_cat_cat` FOREIGN KEY (`SuperCatID`) REFERENCES `category` (`ID`);

--
-- Constraints for table `catpost`
--
ALTER TABLE `catpost`
  ADD CONSTRAINT `fk_CatPost_Cat` FOREIGN KEY (`CatID`) REFERENCES `category` (`ID`),
  ADD CONSTRAINT `fk_CatPost_Post` FOREIGN KEY (`PostID`) REFERENCES `post` (`ID`);

--
-- Constraints for table `editorcat`
--
ALTER TABLE `editorcat`
  ADD CONSTRAINT `fk_editcat_cat` FOREIGN KEY (`ManagedCatID`) REFERENCES `category` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_editcat_edit` FOREIGN KEY (`UserID`) REFERENCES `userprimary` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subscriber`
--
ALTER TABLE `subscriber`
  ADD CONSTRAINT `fk_subs_user` FOREIGN KEY (`UserID`) REFERENCES `userprimary` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tagpost`
--
ALTER TABLE `tagpost`
  ADD CONSTRAINT `fk_tagpost_post` FOREIGN KEY (`PostID`) REFERENCES `post` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tagpost_tag` FOREIGN KEY (`TagID`) REFERENCES `tag` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `writer`
--
ALTER TABLE `writer`
  ADD CONSTRAINT `fk_writer_user` FOREIGN KEY (`UserID`) REFERENCES `userprimary` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `writerpost`
--
ALTER TABLE `writerpost`
  ADD CONSTRAINT `fk_writerp_post` FOREIGN KEY (`PostID`) REFERENCES `post` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_writerp_writer` FOREIGN KEY (`WriterID`) REFERENCES `writer` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

USE `th16news`;

DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PostID` int(11) NOT NULL,
  `UserID` varchar(50) DEFAULT NULL,
  `Content` text NOT NULL,
  `IsDelete` int(1) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `comment`
  ADD CONSTRAINT `fk_comm_post` FOREIGN KEY (`PostID`) REFERENCES `post` (`ID`);

ALTER TABLE `comment`
  ADD CONSTRAINT `fk_comm_user` FOREIGN KEY (`UserID`) REFERENCES `userprimary` (`ID`);

ALTER TABLE `tag` ADD FULLTEXT KEY (`TagName`);

ALTER table `userprimary` ADD FULLTEXT KEY (`FullName`);