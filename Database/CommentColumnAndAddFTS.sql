
DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment` (
  `ID` varchar(50) NOT NULL,
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