-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 25, 2025 at 10:26 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbmogchs`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbldocument`
--

CREATE TABLE `tbldocument` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbldocument`
--

INSERT INTO `tbldocument` (`id`, `name`, `userId`, `createdAt`) VALUES
(5, 'SF10', '02-1819-01509', '2025-07-24 14:01:00'),
(6, 'Diploma', '02-1819-01509', '2025-07-24 14:01:00'),
(7, 'CAV', '02-1819-01509', '2025-07-24 14:01:00'),
(8, 'Certificate of Enrollment', '02-1819-01509', '2025-07-24 14:01:00');

-- --------------------------------------------------------

--
-- Table structure for table `tblrequest`
--

CREATE TABLE `tblrequest` (
  `id` int(11) NOT NULL,
  `studentId` varchar(50) NOT NULL,
  `documentId` int(11) NOT NULL,
  `purpose` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblrequest`
--

INSERT INTO `tblrequest` (`id`, `studentId`, `documentId`, `purpose`, `createdAt`) VALUES
(11, '02-1818-01509', 5, 'College Application', '2025-07-24 10:05:43'),
(12, '02-1818-01509', 6, 'Employment', '2025-07-24 11:28:16'),
(13, '02-1818-01509', 5, 'Employment', '2025-07-25 08:20:55'),
(14, '02-1818-01509', 6, 'Employment', '2025-07-25 08:25:46');

-- --------------------------------------------------------

--
-- Table structure for table `tblrequeststatus`
--

CREATE TABLE `tblrequeststatus` (
  `id` int(11) NOT NULL,
  `requestId` int(11) NOT NULL,
  `statusId` int(11) NOT NULL,
  `userId` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblrequeststatus`
--

INSERT INTO `tblrequeststatus` (`id`, `requestId`, `statusId`, `userId`, `createdAt`) VALUES
(7, 11, 1, NULL, '2025-07-24 10:05:43'),
(8, 11, 2, NULL, '2025-07-24 10:22:47'),
(9, 11, 2, NULL, '2025-07-24 10:22:51'),
(10, 11, 3, NULL, '2025-07-24 11:07:45'),
(11, 11, 4, NULL, '2025-07-24 11:21:17'),
(12, 12, 1, NULL, '2025-07-24 11:28:16'),
(13, 11, 5, NULL, '2025-07-24 11:29:03'),
(14, 13, 1, NULL, '2025-07-25 08:20:55'),
(15, 14, 1, NULL, '2025-07-25 08:25:46'),
(20, 13, 2, NULL, '2025-07-26 04:20:29');

-- --------------------------------------------------------

--
-- Table structure for table `tblrequirements`
--

CREATE TABLE `tblrequirements` (
  `id` int(11) NOT NULL,
  `requestId` int(11) NOT NULL,
  `filepath` varchar(250) NOT NULL,
  `typeId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblrequirements`
--

INSERT INTO `tblrequirements` (`id`, `requestId`, `filepath`, `typeId`, `createdAt`) VALUES
(1, 13, 'farm.png', 1, '2025-07-25 08:20:55'),
(2, 13, 'licenseId2.png', 2, '2025-07-25 08:20:55'),
(3, 14, 'licenseId.png', 2, '2025-07-25 08:25:46');

-- --------------------------------------------------------

--
-- Table structure for table `tblrequirementstype`
--

CREATE TABLE `tblrequirementstype` (
  `id` int(11) NOT NULL,
  `nameType` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblrequirementstype`
--

INSERT INTO `tblrequirementstype` (`id`, `nameType`, `userId`, `createdAt`) VALUES
(1, 'Diploma', '02-1819-01509', '2025-07-25 07:04:12'),
(2, 'Affidavit of Loss', '02-1819-01509', '2025-07-25 07:04:12');

-- --------------------------------------------------------

--
-- Table structure for table `tblstatus`
--

CREATE TABLE `tblstatus` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblstatus`
--

INSERT INTO `tblstatus` (`id`, `name`, `user_id`, `createdAt`) VALUES
(1, 'Pending', '02-1819-01509', '2025-07-24 13:52:56'),
(2, 'Processed', '02-1819-01509', '2025-07-24 13:52:56'),
(3, 'Signatory', '02-1819-01509', '2025-07-24 13:52:56'),
(4, 'Release', '02-1819-01509', '2025-07-24 13:52:56'),
(5, 'Released', '02-1819-01509', '2025-07-24 13:52:56');

-- --------------------------------------------------------

--
-- Table structure for table `tblstudent`
--

CREATE TABLE `tblstudent` (
  `id` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userLevel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblstudent`
--

INSERT INTO `tblstudent` (`id`, `firstname`, `middlename`, `lastname`, `email`, `password`, `userLevel`) VALUES
('02-1818-01509', 'Patty', '', 'Aspiras', 'patty@gmail.com', '$2y$10$obaOkyOtY84By2tRkIv8Oue9xzy95ixpm9pyTjITO.dKk6O1zxi9K', 4);

-- --------------------------------------------------------

--
-- Table structure for table `tblstudentdocument`
--

CREATE TABLE `tblstudentdocument` (
  `id` int(11) NOT NULL,
  `studentId` varchar(50) NOT NULL,
  `fileName` varchar(100) NOT NULL,
  `documentId` int(11) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblstudentdocument`
--

INSERT INTO `tblstudentdocument` (`id`, `studentId`, `fileName`, `documentId`, `userId`, `createdAt`) VALUES
(1, '02-1818-01509', 'SF10 - Patty.pdf', 5, '02-1819-01500', '2025-07-25 21:23:52');

-- --------------------------------------------------------

--
-- Table structure for table `tbluser`
--

CREATE TABLE `tbluser` (
  `id` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `middlename` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contactNo` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userLevel` int(11) NOT NULL,
  `pinCode` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbluser`
--

INSERT INTO `tbluser` (`id`, `firstname`, `lastname`, `middlename`, `email`, `contactNo`, `password`, `userLevel`, `pinCode`) VALUES
('02-1819-01500', 'Krystyll', 'Plaza', '', 'krystyll@gmail.com', '09090909', '$2y$10$obaOkyOtY84By2tRkIv8Oue9xzy95ixpm9pyTjITO.dKk6O1zxi9K', 1, 1234),
('02-1819-01509', 'Patty', 'Aspiras', '', 'ralp.pelino11@gmail.com', '09056548089', '$2y$10$obaOkyOtY84By2tRkIv8Oue9xzy95ixpm9pyTjITO.dKk6O1zxi9K', 2, 1234);

-- --------------------------------------------------------

--
-- Table structure for table `tbluserlevel`
--

CREATE TABLE `tbluserlevel` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbluserlevel`
--

INSERT INTO `tbluserlevel` (`id`, `name`, `createdAt`) VALUES
(1, 'Registrar', '2025-07-23 08:43:05'),
(2, 'Admin', '2025-07-23 08:43:05'),
(3, 'Teacher', '2025-07-23 08:43:05'),
(4, 'Student', '2025-07-24 13:11:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbldocument`
--
ALTER TABLE `tbldocument`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `tblrequest`
--
ALTER TABLE `tblrequest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `documentId` (`documentId`),
  ADD KEY `studentId` (`studentId`);

--
-- Indexes for table `tblrequeststatus`
--
ALTER TABLE `tblrequeststatus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requestId` (`requestId`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `tblrequirements`
--
ALTER TABLE `tblrequirements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requestId` (`requestId`),
  ADD KEY `typeId` (`typeId`);

--
-- Indexes for table `tblrequirementstype`
--
ALTER TABLE `tblrequirementstype`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `tblstatus`
--
ALTER TABLE `tblstatus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tblstudent`
--
ALTER TABLE `tblstudent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userLevel` (`userLevel`);

--
-- Indexes for table `tblstudentdocument`
--
ALTER TABLE `tblstudentdocument`
  ADD PRIMARY KEY (`id`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `documentId` (`documentId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `tbluser`
--
ALTER TABLE `tbluser`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_level` (`userLevel`);

--
-- Indexes for table `tbluserlevel`
--
ALTER TABLE `tbluserlevel`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbldocument`
--
ALTER TABLE `tbldocument`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tblrequest`
--
ALTER TABLE `tblrequest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tblrequeststatus`
--
ALTER TABLE `tblrequeststatus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tblrequirements`
--
ALTER TABLE `tblrequirements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblrequirementstype`
--
ALTER TABLE `tblrequirementstype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tblstatus`
--
ALTER TABLE `tblstatus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tblstudentdocument`
--
ALTER TABLE `tblstudentdocument`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbluserlevel`
--
ALTER TABLE `tbluserlevel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbldocument`
--
ALTER TABLE `tbldocument`
  ADD CONSTRAINT `tbldocument_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `tbluser` (`id`);

--
-- Constraints for table `tblrequest`
--
ALTER TABLE `tblrequest`
  ADD CONSTRAINT `tblrequest_ibfk_1` FOREIGN KEY (`documentId`) REFERENCES `tbldocument` (`id`),
  ADD CONSTRAINT `tblrequest_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `tblstudent` (`id`);

--
-- Constraints for table `tblrequeststatus`
--
ALTER TABLE `tblrequeststatus`
  ADD CONSTRAINT `tblrequeststatus_ibfk_1` FOREIGN KEY (`requestId`) REFERENCES `tblrequest` (`id`),
  ADD CONSTRAINT `tblrequeststatus_ibfk_2` FOREIGN KEY (`statusId`) REFERENCES `tblstatus` (`id`),
  ADD CONSTRAINT `tblrequeststatus_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `tbluser` (`id`);

--
-- Constraints for table `tblrequirements`
--
ALTER TABLE `tblrequirements`
  ADD CONSTRAINT `tblrequirements_ibfk_1` FOREIGN KEY (`requestId`) REFERENCES `tblrequest` (`id`),
  ADD CONSTRAINT `tblrequirements_ibfk_2` FOREIGN KEY (`typeId`) REFERENCES `tblrequirementstype` (`id`);

--
-- Constraints for table `tblrequirementstype`
--
ALTER TABLE `tblrequirementstype`
  ADD CONSTRAINT `tblrequirementstype_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `tbluser` (`id`);

--
-- Constraints for table `tblstatus`
--
ALTER TABLE `tblstatus`
  ADD CONSTRAINT `tblstatus_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbluser` (`id`);

--
-- Constraints for table `tblstudent`
--
ALTER TABLE `tblstudent`
  ADD CONSTRAINT `tblstudent_ibfk_1` FOREIGN KEY (`userLevel`) REFERENCES `tbluserlevel` (`id`);

--
-- Constraints for table `tblstudentdocument`
--
ALTER TABLE `tblstudentdocument`
  ADD CONSTRAINT `tblstudentdocument_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `tblstudent` (`id`),
  ADD CONSTRAINT `tblstudentdocument_ibfk_2` FOREIGN KEY (`documentId`) REFERENCES `tbldocument` (`id`),
  ADD CONSTRAINT `tblstudentdocument_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `tbluser` (`id`);

--
-- Constraints for table `tbluser`
--
ALTER TABLE `tbluser`
  ADD CONSTRAINT `tbluser_ibfk_1` FOREIGN KEY (`userLevel`) REFERENCES `tbluserlevel` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
