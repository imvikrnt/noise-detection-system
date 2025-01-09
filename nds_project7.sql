--		===		===		===		===		===		===		===		===		===		===			===			===      --
--
--     							  WELCOME TO NEW PROJECT NAMED "NDS_PROJECT7"      							     --
--                      FIRST YOU NEED CREATE SCHEMA OR DATBASE NAMED "nds_project7"                             --
--                                 CREATE SCHEMA `nds_project7` ;                                                --
-- 							After that you can need only execute the sql file. 									 --
-- 						Make sure your data bade is connect to your app or site 								 --
--																												 --
--		===		===		===		===		===		===		===		===		===		===			===			===      --
-- 	===========================================================================================================  --
--		===		===		===		===		===		===		===		===		===		===			===			===      --

											--   CREATE USER TABLE   --
                                            
CREATE TABLE `nds_project7`.`user` (
  `userid` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT 'none',
  `dob` VARCHAR(20) NOT NULL DEFAULT 'none',
  `email` VARCHAR(200) NOT NULL DEFAULT 'none',
  `password` VARCHAR(300) NOT NULL DEFAULT 'none',
  `repassword` VARCHAR(300) NOT NULL DEFAULT 'none',
  `otpe` VARCHAR(12) NOT NULL DEFAULT 'none',
  `otpm` VARCHAR(12) NOT NULL DEFAULT 'none',
  PRIMARY KEY (`userid`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);
  
ALTER TABLE `nds_project7`.`user` 
ADD COLUMN `phone` VARCHAR(20) NOT NULL DEFAULT 'none' AFTER `name`,
CHANGE COLUMN `email` `email` VARCHAR(200) NOT NULL DEFAULT 'none' AFTER `phone`,
ADD UNIQUE INDEX `phone_UNIQUE` (`phone` ASC) VISIBLE;
;

