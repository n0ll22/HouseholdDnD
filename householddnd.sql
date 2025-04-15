-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2024 at 12:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `householddnd`
--

-- --------------------------------------------------------

--
-- List structure for table `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `exp` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `tutorials` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`tutorials`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `exp`, `title`, `description`, `tutorials`) VALUES
(1, 50, 'Microwave Safari', 'Head to the kitchen, open the microwave, and see what culinary treasures your housemates have left behind...', '[null,\"asd\"]'),
(2, 60, 'Vacuuming for Lost Items', 'Embark on a quest to find the items your vacuum decided to hide in the abyss of eternal oblivion.', '[null]'),
(3, 40, 'Toilet Seat Engineering Project', 'Gather those cardboard boxes and other unused items to create an alternative toilet seat.', '[null]'),
(4, 55, 'Laundry Hanging Marathon', 'Race against time as you try to hang freshly washed clothes before the cat decides to claim them as its own.', '[null]'),
(5, 45, 'Waste Management Performance', 'Practice the art of precise garbage sorting to learn the true distinction between trash and compost.', '[null]'),
(6, 55, 'Dishwashing Symphony', 'Improvise your way through the kitchen with the sound of clinking dishes as your background music.', '[null]'),
(7, 30, 'Pillow Fluffing Contest', 'Engage in a fierce competition with your pillows to see who can fluff up the most.', '[null]'),
(8, 40, 'Socks Sorting Extravaganza', 'Embark on a journey to find the missing sock in the sock drawer abyss.', '[null]'),
(9, 35, 'Plant Whispering Hour', 'Spend quality time with your leafy friends, whispering words of encouragement to help them grow.', '[null]'),
(10, 50, 'Remote Control Safari', 'Navigate through the wild terrain of your living room to locate the elusive remote control.', '[null]'),
(11, 45, 'Cabinet Tetris Challenge', 'Test your spatial awareness skills as you attempt to fit one more item into an already packed cabinet.', '[null]'),
(12, 30, 'Spider Relocation Program', 'Participate in the humane relocation of spiders from indoors to outdoors, one cup and paper at a time.', '[null]'),
(13, 55, 'Bed-Making Olympics', 'Compete against the clock to see how fast you can make your bed while maintaining military precision.', '[null]'),
(14, 60, 'Window Cleaning Masterclass', 'Unlock the secrets of streak-free windows while dodging the inevitable nosy neighbor who always seems to appear.', '[null]'),
(15, 50, 'Fridge Archaeology Expedition', 'Embark on an archaeological adventure through the depths of your fridge to uncover forgotten treasures and ancient relics.', '[null]'),
(16, 60, 'Laundry Sorting Dance Party', 'Turn laundry sorting into a funky dance party where each sock gets its own solo.', '[null]'),
(17, 0, 'Vaccum Cleaner Racing Championship', 'Race against the clock to see how quickly you can vacuum each room, with bonus points for obstacle dodging.', '[null]'),
(18, 65, 'Toilet Bowl Picasso Challenge', 'Express your inner artist by turning toilet cleaning into a modern art masterpiece.', '[null]'),
(19, 45, 'Grocery Bag Ninja Training', 'Channel your inner ninja as you attempt to carry all the grocery bags in one trip from the car to the kitchen.', '[null]'),
(20, 30, 'Dust Bunny Zoo Safari', 'Embark on a safari through your home to capture and release the elusive dust bunnies back into the wild.', '[null]'),
(21, 60, 'Shoe Rack Tetris Tournament', 'Challenge yourself to a game of shoe rack Tetris to fit all your shoes in perfect harmony.', '[null]'),
(22, 40, 'Candlelit Dinner with Dishes', 'Create a romantic ambiance by dining by candlelight while conquering the pile of dishes in the sink.', '[null]'),
(23, 65, 'Mop and Bucket Roller Derby', 'Transform mopping the floor into an adrenaline-fueled roller derby match with your trusty mop as your steed.', '[null]'),
(24, 55, 'Pantry Jenga Championship', 'Test your stacking skills in the ultimate game of pantry Jenga as you try to retrieve the cereal box without toppling the tower.', '[null]'),
(25, 70, 'Oven Cleaning Karaoke Party', 'Belt out your favorite tunes as you scrub away the grime from your oven, with a karaoke microphone doubling as your cleaning wand.', '[null]'),
(26, 5, 'Mop', 'fun', '[null]'),
(27, 100, 'debugTask', 'This a debugger task', '[\"asdaafffasdasada\"]');

-- --------------------------------------------------------

--
-- List structure for table `user`
--

CREATE TABLE `user` (
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pfp` text NOT NULL,
  `taskToday` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`taskToday`)),
  `exp` int(11) NOT NULL,
  `lvl` int(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`name`, `password`, `pfp`, `taskToday`, `exp`, `lvl`, `id`) VALUES
('guest', '$2a$10$ShFY75EascrA2n99h2nv.uqqceJLbhF2qWxc6CS3MZOg4imDcdLxi', '', '[]', 125, 2, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
