/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50520
Source Host           : localhost:3306
Source Database       : mytest

Target Server Type    : MYSQL
Target Server Version : 50520
File Encoding         : 65001

Date: 2019-09-18 22:45:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `nickname` varchar(20) NOT NULL,
  `gender` smallint(1) DEFAULT NULL,
  `age` smallint(6) DEFAULT NULL,
  `hobby` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'zhangsan', '123456', '张三', '1', '18', null);
INSERT INTO `user` VALUES ('2', 'lisi', '789456', '李四', '1', '25', null);
INSERT INTO `user` VALUES ('3', 'wangba', '963258', '王八', '0', '12', null);
INSERT INTO `user` VALUES ('4', 'laoliu', 'laoliu', '老刘', '0', '20', '唱歌跳舞打豆豆');
INSERT INTO `user` VALUES ('5', 'laoliu', 'laoliu', '老刘', '0', '20', '唱歌跳舞打豆豆');
INSERT INTO `user` VALUES ('6', 'laoliu', 'laoliu', '老刘', '0', '20', '唱歌跳舞打豆豆');
INSERT INTO `user` VALUES ('7', 'laoliu', 'laoliu', '老刘', '0', '20', '唱歌跳舞打豆豆');
INSERT INTO `user` VALUES ('8', 'laoliu', 'laoliu', '老刘', '0', '20', '唱歌跳舞打豆豆');
INSERT INTO `user` VALUES ('9', 'laoliu', 'laoliu', '老刘', '0', '20', '唱歌跳舞打豆豆');
