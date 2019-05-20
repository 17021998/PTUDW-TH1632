/*
 Navicat Premium Data Transfer

 Source Server         : ...
 Source Server Type    : MySQL
 Source Server Version : 100139
 Source Host           : localhost:3306
 Source Schema         : th16news

 Target Server Type    : MySQL
 Target Server Version : 100139
 File Encoding         : 65001

 Date: 20/05/2019 21:15:18
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for catagory
-- ----------------------------
DROP TABLE IF EXISTS `catagory`;
CREATE TABLE `catagory`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CatName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `SuperCatID` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `fk_cat_cat`(`SuperCatID`) USING BTREE,
  CONSTRAINT `fk_cat_cat` FOREIGN KEY (`SuperCatID`) REFERENCES `catagory` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for catpost
-- ----------------------------
DROP TABLE IF EXISTS `catpost`;
CREATE TABLE `catpost`  (
  `CatID` int(11) NOT NULL,
  `PostID` int(11) NOT NULL,
  PRIMARY KEY (`CatID`, `PostID`) USING BTREE,
  INDEX `fk_CatPost_Post`(`PostID`) USING BTREE,
  CONSTRAINT `fk_CatPost_Cat` FOREIGN KEY (`CatID`) REFERENCES `catagory` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_CatPost_Post` FOREIGN KEY (`PostID`) REFERENCES `post` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for editor
-- ----------------------------
DROP TABLE IF EXISTS `editor`;
CREATE TABLE `editor`  (
  `UserID` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`UserID`) USING BTREE,
  CONSTRAINT `fk_edit_user` FOREIGN KEY (`UserID`) REFERENCES `userprimary` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for editorcat
-- ----------------------------
DROP TABLE IF EXISTS `editorcat`;
CREATE TABLE `editorcat`  (
  `UserID` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ManagedCatID` int(11) NOT NULL,
  PRIMARY KEY (`UserID`, `ManagedCatID`) USING BTREE,
  INDEX `fk_editcat_cat`(`ManagedCatID`) USING BTREE,
  CONSTRAINT `fk_editcat_edit` FOREIGN KEY (`UserID`) REFERENCES `editor` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_editcat_cat` FOREIGN KEY (`ManagedCatID`) REFERENCES `catagory` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Premium` int(11) NOT NULL,
  `PostStatus` int(11) NULL DEFAULT NULL,
  `Title` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `Abstract` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `ReleaseDay` date NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for subscriber
-- ----------------------------
DROP TABLE IF EXISTS `subscriber`;
CREATE TABLE `subscriber`  (
  `UserID` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Status` int(11) NULL DEFAULT NULL,
  `BeginDay` date NULL DEFAULT NULL,
  PRIMARY KEY (`UserID`) USING BTREE,
  CONSTRAINT `fk_subs_user` FOREIGN KEY (`UserID`) REFERENCES `userprimary` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TagName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for tagpost
-- ----------------------------
DROP TABLE IF EXISTS `tagpost`;
CREATE TABLE `tagpost`  (
  `TagID` int(11) NOT NULL,
  `PostID` int(11) NOT NULL,
  PRIMARY KEY (`TagID`, `PostID`) USING BTREE,
  INDEX `fk_tagpost_post`(`PostID`) USING BTREE,
  CONSTRAINT `fk_tagpost_post` FOREIGN KEY (`PostID`) REFERENCES `post` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tagpost_tag` FOREIGN KEY (`TagID`) REFERENCES `tag` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for userprimary
-- ----------------------------
DROP TABLE IF EXISTS `userprimary`;
CREATE TABLE `userprimary`  (
  `ID` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ProviderCo` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `FullName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Photo` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `DoB` date NULL DEFAULT NULL,
  `PassHash` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for writer
-- ----------------------------
DROP TABLE IF EXISTS `writer`;
CREATE TABLE `writer`  (
  `UserID` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `WriterName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`UserID`) USING BTREE,
  CONSTRAINT `fk_writer_user` FOREIGN KEY (`UserID`) REFERENCES `userprimary` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for writerpost
-- ----------------------------
DROP TABLE IF EXISTS `writerpost`;
CREATE TABLE `writerpost`  (
  `WriterID` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `PostID` int(11) NOT NULL,
  PRIMARY KEY (`WriterID`, `PostID`) USING BTREE,
  INDEX `fk_writerp_post`(`PostID`) USING BTREE,
  CONSTRAINT `fk_writerp_post` FOREIGN KEY (`PostID`) REFERENCES `post` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_writerp_writer` FOREIGN KEY (`WriterID`) REFERENCES `writer` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
