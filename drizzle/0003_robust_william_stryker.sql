CREATE TABLE `content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`heroHeadline` text NOT NULL,
	`heroSubheadline` text NOT NULL,
	`heroDescription` text NOT NULL,
	`heroCTAText` varchar(255) NOT NULL DEFAULT 'Get Started',
	`heroCTALink` varchar(500) NOT NULL DEFAULT '#',
	`featuresTitle` text NOT NULL,
	`featuresDescription` text NOT NULL,
	`ctaTitle` text NOT NULL,
	`ctaDescription` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_id` PRIMARY KEY(`id`)
);

CREATE TABLE `owner` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`passwordHash` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `owner_id` PRIMARY KEY(`id`),
	CONSTRAINT `owner_username_unique` UNIQUE(`username`)
);

CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`primaryColor` varchar(7) NOT NULL,
	`secondaryColor` varchar(7) NOT NULL,
	`accentColor` varchar(7) NOT NULL,
	`backgroundColor` varchar(7) NOT NULL,
	`textColor` varchar(7) NOT NULL,
	`fontFamily` varchar(100) NOT NULL,
	`backgroundStyle` varchar(50) NOT NULL,
	`backgroundGradient` text,
	`showHero` boolean NOT NULL,
	`showFeatures` boolean NOT NULL,
	`showCTA` boolean NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`)
);

INSERT INTO `content` (heroHeadline, heroSubheadline, heroDescription, featuresTitle, featuresDescription, ctaTitle, ctaDescription) VALUES ('Welcome to YouEnvy.me', 'Create your perfect online presence', 'Build and customize your website with ease', 'Features', 'Everything you need to succeed', 'Ready to Get Started?', 'Join thousands of satisfied users today');

INSERT INTO `settings` (primaryColor, secondaryColor, accentColor, backgroundColor, textColor, fontFamily, backgroundStyle, showHero, showFeatures, showCTA) VALUES ('#3b82f6', '#1f2937', '#f59e0b', '#ffffff', '#000000', 'sans-serif', 'solid', true, true, true);