-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2019 at 04:50 PM

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CatName` varchar(50) DEFAULT NULL,
  `SuperCatID` int(11) DEFAULT NULL,
  `IsDelete` int(1) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_cat_cat` (`SuperCatID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `catpost`
--

DROP TABLE IF EXISTS `catpost`;
CREATE TABLE IF NOT EXISTS `catpost` (
  `CatID` int(11) NOT NULL,
  `PostID` int(11) NOT NULL,
  `IsDelete` int(1) DEFAULT NULL,
  PRIMARY KEY (`CatID`,`PostID`),
  KEY `fk_CatPost_Post` (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `editor`
--

DROP TABLE IF EXISTS `editor`;
CREATE TABLE IF NOT EXISTS `editor` (
  `UserID` varchar(50) NOT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

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

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE IF NOT EXISTS `post` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Premium` int(11) NOT NULL,
  `PostStatus` int(11) DEFAULT NULL,
  `Title` varchar(50) DEFAULT NULL,
  `ImgMain` text,
  `Content` text,
  `Abstract` text,
  `ReleaseDay` date DEFAULT NULL,
  `IsDelete` int(1) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `subscriber`
--

DROP TABLE IF EXISTS `subscriber`;
CREATE TABLE IF NOT EXISTS `subscriber` (
  `UserID` varchar(50) NOT NULL,
  `Status` int(11) DEFAULT NULL,
  `BeginDay` date DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `Photo` varchar(50) DEFAULT NULL,
  `DoB` date DEFAULT NULL,
  `PassHash` varchar(50) DEFAULT NULL,
  `IsDelete` int(1) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
-- Constraints for table `editor`
--
ALTER TABLE `editor`
  ADD CONSTRAINT `fk_edit_user` FOREIGN KEY (`UserID`) REFERENCES `userprimary` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `editorcat`
--
ALTER TABLE `editorcat`
  ADD CONSTRAINT `fk_editcat_cat` FOREIGN KEY (`ManagedCatID`) REFERENCES `category` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_editcat_edit` FOREIGN KEY (`UserID`) REFERENCES `editor` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

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
