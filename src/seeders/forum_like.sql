-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 27, 2023 at 02:21 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `unity_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `forum_like`
--

CREATE TABLE `forum_like` (
  `id` int(11) NOT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `forumId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `forum_like`
--

INSERT INTO `forum_like` (`id`, `uuid`, `createdAt`, `updatedAt`, `forumId`, `userId`) VALUES
(5, '8563b7f8-66f2-43e5-b68d-938361f15e5c', '2023-05-26 11:15:39', '2023-05-26 11:15:39', 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `forum_like`
--
ALTER TABLE `forum_like`
  ADD PRIMARY KEY (`id`),
  ADD KEY `forumId` (`forumId`),
  ADD KEY `userId` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `forum_like`
--
ALTER TABLE `forum_like`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `forum_like`
--
ALTER TABLE `forum_like`
  ADD CONSTRAINT `forum_like_ibfk_1` FOREIGN KEY (`forumId`) REFERENCES `forum` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `forum_like_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
