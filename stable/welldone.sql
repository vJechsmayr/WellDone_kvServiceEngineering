-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 01. Mai 2016 um 12:02
-- Server-Version: 10.1.10-MariaDB
-- PHP-Version: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `welldone`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `activity`
--

CREATE TABLE `activity` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `activitystatus` int(11) NOT NULL,
  `responsibleUser` int(11) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `previousid` int(11) DEFAULT NULL,
  `projectid` int(11) NOT NULL,
  `activitytype` int(11) NOT NULL DEFAULT '0',
  `priority` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `activity`
--

INSERT INTO `activity` (`id`, `title`, `activitystatus`, `responsibleUser`, `start`, `end`, `description`, `previousid`, `projectid`, `activitytype`, `priority`) VALUES
(5, 'Brainstorming & Recherche PM-Tools', 7, 1, '2016-04-18', '2016-04-22', 'Suche nach existierenden PM-Tools auf Web-basis', NULL, 6, 1, NULL),
(6, 'Aufbau Grundstrktur HTML', 7, 1, '2016-04-21', '2016-04-21', 'Grundstruktur der Webseite aufbauen (Dashboard)\nSkizzen der Projekt, Aufgabenseite und Zeitaufzeichnung erstellen', NULL, 6, 2, NULL),
(7, 'Testdaten export fehlerhaft', 5, 11, '2016-05-01', '2016-05-01', 'Testdaten wurden aus phpmyadmin exportiert.\nJedoch befindet sich nur die DB-Struktur im sql File.\n\nTestdaten fehlen. Bitte um kontrolle!', 6, 6, 3, NULL),
(8, 'DB-Export', 5, 1, '2016-04-30', '2016-05-01', 'Daten aus phpmyadmin-DB exportiert und in Projektverzeichnis abgelegt.\n\nTestdaten werden noch gelöscht und durch sinnvolle Daten ersetzt.', 6, 6, 1, NULL),
(9, 'Server-Implementierung', 7, 1, '2016-04-22', '2016-04-30', 'Implementierung der Logik;\nNodeJS mit express-Framework;\nserver.js sollte unterteilt werden für eine bessere Übersicht!', 6, 6, 1, NULL),
(10, 'Client-Implementierung', 7, 1, '2016-04-22', '2016-04-30', 'Implementierung der Logik clientseitig;\nAngularJS, jQuery als JS-Lösungen,\nBootstrap-Framework für CSS und Struktur Vorlage;\nDashboard sollte Zentraler Baustein sein', 6, 6, 1, NULL),
(11, 'Dokumentation', 3, 11, '2016-05-01', '2016-05-02', 'Dokumentation der Lösung aus Benutzer- und Implementierungssicht. \nDiskusion von verwendeten Protokollen, Datenformaten und Kodierungen.', NULL, 6, 1, NULL),
(12, 'Implementierung abschließen', 7, 1, '2016-04-30', '2016-04-30', 'Implementierung abschließen um Team-Kollegen den Code zur Durchsicht übergeben zu können.', 10, 6, 2, NULL),
(13, 'Bug: Prioritäten werden nicht mehr angezeigt', 1, 12, '2016-05-01', '2016-05-01', 'Beim Einfügen der Testdaten wurde bemerkt dass die Prioritäten bei Tickets nicht mehr angezeigt werden.\n\nSollte in der nächsten Version ausgebessert werden!', 10, 6, 3, NULL),
(14, 'Feature: Meilenstein-Datum ist 1 Tag!', 1, 12, '2016-05-01', '2016-05-01', 'Beim anlegen der Meilensteine der Testdaten wurde bemerkt dass ein Meilenstein nur ein End-Datum haben sollte! Da der Zeitpunkt eines Meilensteins nur 1 Tag ist.', 11, 6, 3, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `activitycomments`
--

CREATE TABLE `activitycomments` (
  `id` int(11) NOT NULL,
  `comment` varchar(200) NOT NULL,
  `userid` int(11) NOT NULL,
  `activityid` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `activitycomments`
--

INSERT INTO `activitycomments` (`id`, `comment`, `userid`, `activityid`, `created_at`) VALUES
(5, '"BlueAnt" gefunden und als Vorlage für Seitenaufbau genommen. \nScreenshots wurden in das Projektverzeichnis gespeichert.', 1, 5, '2016-04-21 09:27:05'),
(6, 'Protokoll: Es wurde das http-Protokoll für die AJAX Kommunikation verwendet. Dabei wurde sowohl die get- als auch die post-Methode verwendet um die Daten zu übertragen.', 1, 11, '2016-05-01 09:38:15'),
(7, 'Datenformat: Es wurde JSON als Datenformat für die Übertragung verwendet.', 1, 11, '2016-05-01 09:38:51'),
(8, 'Entwicklungsumgebung: Es wurde Notepad++ und Visual Studio Code zur Entwicklung verwendet.', 1, 11, '2016-05-01 09:39:38'),
(9, 'Kodierung: Es wurde in den HTML-Files im Header der charset "utf-8" angegeben für die Korrekte darstellung der Zeichen.', 1, 11, '2016-05-01 09:42:58'),
(10, 'Kodierung: Auf der Datenbank wurde als Zeichensatz ebenfalls auf utf-8 geändert, da vorher auf latin-1 angelegt.', 1, 11, '2016-05-01 09:47:46');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `activitystatus`
--

CREATE TABLE `activitystatus` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `activitystatus`
--

INSERT INTO `activitystatus` (`id`, `title`) VALUES
(8, 'Abgebrochen'),
(7, 'Fertig'),
(3, 'in Bearbeitung'),
(6, 'in Warteschleife/übergeben an MA'),
(1, 'Neu'),
(2, 'Offen'),
(4, 'warte auf Kundenantwort'),
(5, 'warte auf Mitarbeiter/Abteilung-Rückmeldung');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `activitytype`
--

CREATE TABLE `activitytype` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `hasPriority` tinyint(1) NOT NULL DEFAULT '0',
  `headline` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `activitytype`
--

INSERT INTO `activitytype` (`id`, `title`, `hasPriority`, `headline`) VALUES
(1, 'Aufgabe', 0, 'Aufgaben'),
(2, 'Meilenstein', 0, 'Meilensteine'),
(3, 'Ticket', 1, 'Tickets');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `priority`
--

CREATE TABLE `priority` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `priority`
--

INSERT INTO `priority` (`id`, `title`) VALUES
(4, 'mögliche Neuentwicklung'),
(3, 'nächste Release-Version'),
(1, 'nice to have'),
(2, 'so schnell wie möglich - Erste Priorität');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `status` int(11) NOT NULL,
  `owner` int(11) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `projects`
--

INSERT INTO `projects` (`id`, `title`, `status`, `owner`, `start`, `end`, `type`) VALUES
(6, 'WellDone Entwicklung', 5, 1, '2016-04-01', '2016-05-01', 1),
(7, 'WellDone - HandyApp Entwicklung', 1, 12, '2016-05-09', '2016-06-30', 2);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projectstatus`
--

CREATE TABLE `projectstatus` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `projectstatus`
--

INSERT INTO `projectstatus` (`id`, `title`) VALUES
(6, 'Abgebrochen'),
(5, 'Abgeschlossen'),
(4, 'Abnahme'),
(2, 'Freigabe'),
(1, 'in Planung'),
(3, 'in Umsetzung');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projecttypes`
--

CREATE TABLE `projecttypes` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `projecttypes`
--

INSERT INTO `projecttypes` (`id`, `title`) VALUES
(1, 'internes Projekt'),
(2, 'Kundenprojekt');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `timetracking`
--

CREATE TABLE `timetracking` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `day` date NOT NULL,
  `timefrom` time NOT NULL,
  `timeto` time NOT NULL,
  `activityid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `timetracking`
--

INSERT INTO `timetracking` (`id`, `userid`, `day`, `timefrom`, `timeto`, `activityid`) VALUES
(19, 1, '2016-04-18', '12:30:00', '15:30:00', 5),
(20, 1, '2016-04-19', '18:00:00', '19:30:00', 6),
(21, 1, '2016-04-20', '08:00:00', '09:30:00', 5),
(22, 1, '2016-04-24', '15:00:00', '19:00:00', 9),
(23, 1, '2016-04-24', '21:30:00', '22:15:00', 10),
(24, 1, '2016-04-25', '10:30:00', '12:30:00', 6),
(25, 1, '2016-04-25', '15:30:00', '19:00:00', 10),
(26, 1, '2016-04-26', '11:00:00', '13:30:00', 9),
(27, 1, '2016-04-26', '14:00:00', '19:30:00', 10),
(28, 1, '2016-04-26', '20:30:00', '22:00:00', 10),
(29, 1, '2016-04-27', '10:00:00', '11:35:00', 6),
(30, 1, '2016-04-27', '12:30:00', '19:00:00', 10),
(31, 1, '2016-04-28', '20:00:00', '22:30:00', 9),
(32, 1, '2016-04-29', '21:00:00', '23:59:00', 12),
(33, 1, '2016-04-30', '00:00:00', '02:00:00', 12),
(34, 1, '2016-04-30', '10:00:00', '13:30:00', 12),
(35, 1, '2016-04-30', '14:30:00', '17:00:00', 8);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `passwort` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `firstname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `admin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `email`, `passwort`, `firstname`, `lastname`, `created_at`, `active`, `admin`) VALUES
(1, 'viktoria@jechsmayr.at', 'LUXgI3M/x6262EGtDu0P6Ptmp8BSBSmvljnlSX1+gbY=', 'Viktoria', 'Jechsmayr', '2016-04-24 13:44:59', 1, 1),
(11, 'michael@lehner.at', 'WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U=', 'Michael', 'Lehner', '2016-05-01 09:22:49', 1, 0),
(12, 'dominik@hattenberger.at', 'WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U=', 'Dominik', 'Hattenberger', '2016-05-01 09:23:21', 1, 0),
(13, 'klaus@hoeflmeier.at', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'Klaus', 'Höflmeier', '2016-05-01 09:23:50', 0, 0);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `activitycomments`
--
ALTER TABLE `activitycomments`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `activitystatus`
--
ALTER TABLE `activitystatus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`);

--
-- Indizes für die Tabelle `activitytype`
--
ALTER TABLE `activitytype`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`);

--
-- Indizes für die Tabelle `priority`
--
ALTER TABLE `priority`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`);

--
-- Indizes für die Tabelle `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner` (`owner`),
  ADD KEY `type` (`type`),
  ADD KEY `status` (`status`);

--
-- Indizes für die Tabelle `projectstatus`
--
ALTER TABLE `projectstatus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`);

--
-- Indizes für die Tabelle `projecttypes`
--
ALTER TABLE `projecttypes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`);

--
-- Indizes für die Tabelle `timetracking`
--
ALTER TABLE `timetracking`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userid` (`userid`,`day`,`timefrom`,`timeto`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `activity`
--
ALTER TABLE `activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT für Tabelle `activitycomments`
--
ALTER TABLE `activitycomments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT für Tabelle `activitystatus`
--
ALTER TABLE `activitystatus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT für Tabelle `activitytype`
--
ALTER TABLE `activitytype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT für Tabelle `priority`
--
ALTER TABLE `priority`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT für Tabelle `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT für Tabelle `projectstatus`
--
ALTER TABLE `projectstatus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT für Tabelle `projecttypes`
--
ALTER TABLE `projecttypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT für Tabelle `timetracking`
--
ALTER TABLE `timetracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
