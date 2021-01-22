const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(function () {

    // drop the stations table if it already exists
    db.run('DROP TABLE IF EXISTS `stations`')

    // create the new stations table
    db.run('CREATE TABLE `stations` (' +
    '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'+
    '`name` TEXT,' +
    '`description` TEXT,' +
    '`tagline` TEXT,' +
    '`logo` TEXT,' +
    '`website_url` TEXT,' +
    '`stream_url` TEXT) ' +
    '`api_key` TEXT);

    // drop the presenters table if it already exists
    db.run('DROP TABLE IF EXISTS `presenters`')

     // create the new presenters table
     db.run('CREATE TABLE `presenters` (' +
     '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'+
     '`user_id` INTEGER NOT NULL,' +
     '`station_id` TEXT NOT NULL DEFAULT `{}`,' +
     '`name` TEXT,' +
     '`bio` TEXT,' +
     '`image` TEXT) ');

     // drop the schedule table if it already exists
     db.run('DROP TABLE IF EXISTS `schedule`');
     db.run('DROP TABLE IF EXISTS `schedules`');

     //create the new schedule table
     db.run('CREATE TABLE `schedules` (' +
     '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
     '`presenter_id` INTEGER NOT NULL,' +
     '`station_id` INTEGER NOT NULL,' +
     '`day` INTEGER NOT NULL,' +
     '`start_time` INTEGER NOT NULL,' +
     '`end_time` INTEGER NOT NULL,' +
     '`title` TEXT NOT NULL,' +
     '`description` TEXT NOT NULL,' +
     '`image` TEXT NOT NULL,' +
     '`featured` INTEGER NOT NULL DEFAULT 1,' +
     '`hide_until` INTEGER,' +
     '`active` INTEGER NOT NULL DEFAULT 1) ');


     db.run('DROP TABLE IF EXISTS `musiclogs`');

    db.run('CREATE TABLE `musiclogs` (' +
    '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
    '`presenter_id` INTEGER NOT NULL DEFAULT 0,' +
    '`user_id` INTEGER NOT NULL DEFAULT 0,' +
    '`station_id` INTEGER NOT NULL DEFAULT 0,' +
    '`artist` TEXT NOT NULL,' +
    '`title` TEXT NOT NULL,' +
    '`listener_count` INTEGER NOT NULL,' + 
    '`timestamp` INTEGER NOT NULL,' + 
    '`as_album_art` TEXT,' + 
    '`as_uri` TEXT) ');
 
});
