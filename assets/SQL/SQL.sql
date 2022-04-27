CREATE DATABASE sms;

USE sms;

CREATE TABLE stock(
	product_id VARCHAR(10) NOT NULL PRIMARY KEY,
	product_category VARCHAR(20),
	product_name VARCHAR(50),
  quantity INTEGER,
	price DOUBLE,
  created_time DATETIME,
  mod_time DATETIME
);

CREATE TABLE record(
	record_no INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_id VARCHAR(10),
	reference VARCHAR(50),
  change_type VARCHAR(20),
  change_value INTEGER,
	update_date DATETIME
);

CREATE TABLE login(
	username VARCHAR(50) NOT NULL PRIMARY KEY,
	password VARCHAR(30),
	account_type INTEGER
	-- Employee		- Type - 0
	-- User 			- Type - 1
);

CREATE TABLE verification(
	username VARCHAR(50) NOT NULL PRIMARY KEY,
	otp VARCHAR(10),
	confirmed BOOLEAN
);

CREATE TABLE customer(
	username VARCHAR(50) NOT NULL PRIMARY KEY,
	title VARCHAR(5),
	fname VARCHAR(50),
	surname VARCHAR(50),
	contact VARCHAR(50),
	province VARCHAR(50),
	address TEXT
);

CREATE TABLE employee(
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(50) NOT NULL,
	name VARCHAR(50) NOT NULL,
	deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE sales(
	order_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50),
  total DOUBLE,
  date_of_sale TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_breakdown(
		sale_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(20),
    product_id VARCHAR(10),
    quantity INTEGER,
    cost DOUBLE
);
