show tables;
use practice;
-- create advert tables 
CREATE TABLE advert (
    adverttitle VARCHAR(100),
    advertdetails TEXT,
    advertlink VARCHAR(255) DEFAULT 'this cannot be empty'
);
show columns from advert;
describe table advert;
alter table advert add user varchar(30);
alter table advert add created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
alter table advert add updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
alter table advert modify advertdetails text not null;
alter table advert modify adverttitle varchar(100) not null;
alter table advert add _id int auto_increment primary key;

-- create trigger to trim advert title before insert-- 
create trigger trimAdvert before insert on advert for each row 
set new.adverttitle = trim(new.adverttitle);

-- when dealing with triggers you can before/after, insert/update/delete
-- CREATE TRIGGER trigger_name
-- BEFORE/AFTER INSERT/UPDATE/DELETE ON table_name
-- FOR EACH ROW
-- Trigger body (actions to be performed)

-- CREATE TRIGGER trigger_name
-- BEFORE INSERT ON table_name
-- FOR EACH STATEMENT
-- Trigger body (actions for the entire statement)


create table users (
_id int auto_increment primary key,
fullname varchar(1000) not null check(char_length(fullname) between 2 and 1000),
email varchar(255) unique not null,
password varchar(30) check(char_length(password) between 6 and 30) not null,
role enum('admin','user') default 'user',
address varchar(1000) default 'please update your address' not null,
image text,
phone varchar(30) not null unique,
gender enum('male','female') default 'female',
emailNotification bool default false not null,
blacklisted bool default false not null,
verificationString text,
isVerified bool default false not null,
verified datetime,
passwordToken text,
passwordExpirationDate datetime,
created_At datetime default current_timestamp,
updated_At datetime default current_timestamp on update current_timestamp
);
alter table users modify blacklisted boolean default false;
-- alter table users auto_increment = 6475;
-- alter table users modify _id int auto_increment;
-- -- First, reset the auto-increment counter to the desired starting value
-- ALTER TABLE your_table_name AUTO_INCREMENT = 10000000;
-- -- Then, modify the column to set it as auto-increment
-- ALTER TABLE your_table_name MODIFY COLUMN id INT AUTO_INCREMENT;
show columns from users;
show tables;
alter table advert modify user int,add constraint foreign key (user) references users(_id) on delete set  null;
-- --create trigger to set image default
create trigger set_image_default before insert on users for each row set new.image = case when new.gender = 'male' then 'https://res.cloudinary.com/dod7yij4e/image/upload/v1688826394/Users%20Avatar/tmp-1-1688826393784_ajygyi.png'
else 'https://res.cloudinary.com/dod7yij4e/image/upload/v1688826986/Users%20Avatar/tmp-1-1688826985391_boy5kq.png' end;

drop trigger set_image_default;

-- create product table-- 

create table products(
name varchar(120) not null,
price decimal(60,1) not null default 0, 
description varchar(1000) not null,
images varchar(255) not null default "/uploads/example.jpeg",
categoryA enum( "bags",
        "bracelet",
        "waist beads",
        "children wears",
        "brooches",
        "jewelry boxes") not null,
categoryB enum(
        "new arrivals",
        "best sellers",
        "clearance sales",
        "special offers") not null,
size varchar(255) default"large" not null,
colors varchar(7) default "#222",
featured enum("available", "not available") default "not available",
freeshipping enum("available", "not available") default "not available",
inventory int not null default 15,
averageRating int not null default 0,
numOfReviews int not null default 0,
numOfTimesSold int not null default 0,
user int, 
foreign key(user) references users(_id),
createdAt datetime default current_timestamp,
updatedAt datetime default current_timestamp on update current_timestamp 
);

alter table products add _id int auto_increment primary key;
alter table products modify price dec(10,2);
-- create trigger to trim product name 
create trigger trim_product_name before insert on products for each row set new.name = trim(new.name); 
show tables;
show triggers;
alter table products drop images;
alter table products drop colors;

-- create table for inages and colors, these table are linked to products table on a one to many relationship via foreign keys 

create table productImages(
image_id int primary key auto_increment,
product_id int,
images varchar(1000) default "/uploads/example.jpeg",
foreign key(product_id) references products(_id) on delete cascade
);
alter table productImages change image_id _id int primary key auto_increment;
alter table productImages modify _id int auto_increment;  
create table colors (
color_id int primary key auto_increment,
product_id int,
colors varchar(7) default "#222",
foreign key(product_id) references products(_id) on delete cascade
);
alter table colors change color_id _id int;

-- create review table 
create table reviews(
rating int not null check(rating between 1 and 5),
title varchar(100) not null,
comment varchar(100) not null,
user int,
product int,
foreign key(user) references users(_id) on delete cascade,
foreign key(product) references products(_id) on delete cascade,
createdAt datetime default current_timestamp not null,
updatedAt datetime default current_timestamp on update current_timestamp
); 
alter table reviews add _id int auto_increment primary key; 
-- create trigger to trim reviews title 
create trigger trim_review_title before insert on reviews for each row set new.title = trim(new.title); 
-- create review images table
create table review_images(
_id int auto_increment primary key,
review_imgs_id int,
images varchar(255),
foreign key(review_imgs_id) references reviews(_id) on delete cascade
); 

alter table review_images modify images varchar(255) default "https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png" not null;
-- create orders table 
create table orders(
_id int auto_increment primary key,
tax decimal(60,4) not null,
shippingFee decimal(60,4) not null,
subTotal decimal(60,4) not null,
total decimal(60,4) not null,
paymentStatus enum("pending", "failed", "successful", "canceled") default "pending",
deliveryStatus enum("pending", "failed", "delivered", "canceled") default "pending",
tx_ref varchar(100),
transaction_id varchar(100),
user int,
userName varchar(100),
userEmail varchar(100),
userPhone varchar(100),
foreign key(user) references users(_id) on delete cascade
); 
-- create table for order items
create table order_Items(
_id int auto_increment primary key,
name varchar(20) not null,
image varchar(255) not null,
price decimal(60,4) not null,
amount int not null,
color varchar(7),
product int,
foreign key(product) references products(_id) on delete cascade
); 

-- create table for deliveryaddress 
create table deliveryAddress(
_id int auto_increment primary key,
phone varchar(20) not null,
city varchar(255) not null,
state varchar(60) not null,
country int not null,
street varchar(15)
); 
-- create promotion table

create table promotion(
_id int auto_increment primary key,
promName varchar(30) not null,
title varchar(100) not null,
details varchar(500) not null,
images varchar(255) default "https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png" not null,
user int,
createdAt datetime default current_timestamp,
updatedAt datetime default current_timestamp on update current_timestamp,
foreign key(user) references users(_id) on delete set null
);  

create trigger trim_prom_name before insert on promotion for each row set new.promName = trim(new.promName);
create trigger trim_prom_title before insert on promotion for each row set new.title = trim(new.title);

-- create token table 
create table token(
refreshToken varchar(100) not null,
ip varchar(100) not null,
userAgent varchar(100) not null,
isValid bool not null,
user int,
createdAt datetime default current_timestamp,
updatedAt datetime default current_timestamp on update current_timestamp,
foreign key(user) references users(_id) on delete cascade
); 

-- create individual users order table
create table userOrders(
_id int primary key not null,
order_id int,
successful int not null default 0,
pending int not null default 0,
canceled int not null default 0,
failed int not null default 0,
foreign key(order_id) references users(_id) on delete cascade
);  
alter table userOrders modify _id int not null auto_increment;
alter table userOrders change order_id user int;
-- bring the _id column first in the product table
-- alter table products modify _id int after name; 
-- ALTER TABLE products
-- MODIFY COLUMN _id INT AFTER name;
-- alter table reviews drop constraint reviews_ifbk_2;
-- alter table productImages add constraint productimages_ibfk_1 foreign key(product_id) references products(_id);

-- insert values into users
select *, case when blacklisted = 0 then "false" else "true" end as blacklisted from users;
select * from users;
insert into users(fullname,email,password,role,address,phone,gender,isVerified,emailNotification,blacklisted) values("apiaries_16","apiariessixteen@gmail.com","$2a$10$M","admin","Suite 70, This is the admin address","+62 (418) 438-2653","Male",true,true,false); 

insert into users(fullname,email,password,role,address,phone,gender,isVerified,emailNotification,blacklisted) values("Aluino Easson ","aeasson1@icq.com","$2a$10$M6gIK","user","PO Box 35088","+46 (128) 672-4435","Female",false,false,true),("Seamus Halsho.","shalsho2@deviantart.com","$2a$10$8iP","user","Room 1124","+252 (840) 320-9699","Male",true,true,false),("Kippy Eschelle","keschelle3@umich.edu","$2a$10$Pcbk.","user","PO Box 11017","+86 (452) 124-7405","Female",true,false,false),("Sidonnie Inchan","sinchan4@technorati.com","$2a$10$IgsS6HG63zfy","user","Room 1357","+86 (368) 623-9451","Female",true,false,false); 

-- update user image
update users set image = "https://res.cloudinary.com/dod7yij4e/image/upload/v1688826986/Users%20…" where _id = 2;  

-- populate the product table
insert into products(name,price,description,categoryA,categoryB,size,featured,freeShipping,inventory,averageRating,numOfReviews,user,numOfTimesSold) values("Delano Egan",6831.3,"Proin interdum mauris non ligula","bags","new arrivals","medium","not available","not available",6,0,2,1,14);
update products set price = 6831.22 where _id =2;

insert into products(name,price,description,categoryA,categoryB,size,featured,freeShipping,inventory,averageRating,numOfReviews,user,numOfTimesSold) values("New product",1456,"This is another product that just got created","bracelet","clearance sales","large","available","not available",8,5,1,1,12),("New product",600,"this is a superb product","jewelry boxes","best sellers","large","not available","not available",2,0,0,1,13),("Alexis waist bead",29098,"this is a superb product","bracelet","clearance sales","small","not available","available",10,0,0,1,10),("Farmins",3785,"this is for a 2years old","bracelet","special offers","medium","not available","available",7,0,0,1,4); 

select * from productImages;
delete from products where _id = 1;
-- change column position
alter table products modify column name varchar(30) after price; 
alter table products modify inventory bool after freeShipping, modify averageRating bool after inventory, modify numOfReviews bool  after averageRating, modify numOfTimesSold bool after numOfReviews, modify user int after numofTimesSold, modify createdAt datetime after user, modify updatedAt datetime after createdAt;
alter table products modify freeShipping enum("available","not available") after featured;

-- populate user orders table and link it to users table in a one to many relationship 
insert into userorders(order_id,successful,pending,canceled,failed) values(4,1,0,0,2),(5,0,2,0,1),(3,1,3,2,0),(2,1,0,0,3);

-- populate user productImages table and link it to products table in a one to many relationship
-- change product_id column to product
alter table productImages change product_id product int;
alter table productImages change images image0 varchar(256);
alter table productImages add image1 varchar(256), add image2 varchar(256), add image3 varchar(256);
insert into productImages(product,image0,image1,image2,image3) values(2,
"https://res.cloudinary.com/dod7yij4e/image/upload/v1686299357/Oyintola…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1686299356/Oyintola…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1686299356/Oyintola…",
"/uploads/example.jpeg");   
insert into productImages(product,image0,image1,image2,image3) values(6, "https://res.cloudinary.com/dod7yij4e/image/upload/v1689154243/Product%…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1689154241/Product%…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1689154241/Product%…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1689154241/Product%…"),(3,"https://res.cloudinary.com/dod7yij4e/image/upload/v1689204438/Product%…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1689204437/Product%…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1689204437/Product%…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1689204437/Product%…"),(5,"https://res.cloudinary.com/dod7yij4e/image/upload/v1689242050/Product%…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1689242050/Product%…",
"/uploads/example.jpeg",
"/uploads/example.jpeg"),(4,"https://res.cloudinary.com/dod7yij4e/image/upload/v1689242122/Product%…",
"/uploads/example.jpeg","/uploads/example.jpeg","/uploads/example.jpeg");

-- populate colors table and link it to products table in a one to many relationship
alter table colors change colors color0 varchar(7);
alter table colors add color1 varchar(7), add color2 varchar(7),add color3 varchar(7),add color4 varchar(7),add color5 varchar(7);
insert into colors(product,color0,color1,color2,color3,color4,color5) values(6,"#ad6767", null,null,null,null,null),(2,"#f31818","#e1f318", null,null,null,null),(5,"#ce0d0d","#0dbcce",null,null,null,null),(3,"#222","#d20c0c",null,null,null,null),(4,"#120ad6","#847665","#03f642","#3ebb93",null,null);

select * from colors;
select * from productimages;

-- populate reviews table
select * from reviews;

alter table reviews modify rating int after _id, modify title varchar(100) after rating, modify comment varchar(100) after title, modify user int after comment, modify product int after user, modify createdAt datetime after product, modify updatedAt datetime after createdAt;

alter table reviews modify rating int not null, modify title varchar(100) not null, modify comment varchar(100) not null, modify createdAt datetime not null default current_timestamp, modify updatedAt datetime default current_timestamp on update current_timestamp;   

insert into reviews(rating,title,comment,user,product) values(2,"Nice Product","This is a very good product a in very nice",5,2),(5,"Excellent Product","This is a very good product",4,3),(4,"Excellent Product","This is a very good product",3,4),(5,"excellent product","This is an excellent product with that paid attention to details",2,5);
insert into reviews(rating,title,comment,user,product) values(3,"okay Product","This is a very good product is fair",1,6);

-- populate review images and link it to the review table in a one to many relationship;
alter table review_images change images image0 varchar(255) not null default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png' ; 
alter table review_images add image1 varchar(255) not null default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png',add image2 varchar(255) not null default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png',add image3 varchar(255) not null default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png';
alter table review_images add product int; 
alter table review_images add constraint foreign key(product) references reviews(_id) on delete cascade;
alter table review_images change review_imgs_id user int;
alter table review_images modify image0 varchar(255) not null default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png' after product;
alter table review_images modify image1 varchar(255) not null default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png' after image0,modify image2 varchar(255) not null default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png' after image1,modify image3 varchar(255) not null default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png' after image2;

alter table review_images modify image0 varchar(255) default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png',modify image1 varchar(255) default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png',modify image2 varchar(255) default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png',modify image3 varchar(255) default 'https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%20Images/tmp-1-1696329166987_mu2z3n.png';
describe review_images;
select * from review_images;
insert into review_images(user,product,image0,image1,image2,image3) values(5,2,
"https://res.cloudinary.com/dod7yij4e/image/upload/v1696413006/Review%2…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1696413005/Review%2…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%2…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%2…"),(4,3,
"https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%2…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%2…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%2…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%2…"),(3,4,"https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%2…",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1696329171/Review%2…",null,null);
delete from review_images where _id in (4,5,6,7,8,9);

-- populate orders tables;
alter table orders add createdAt datetime default current_timestamp, add updatedAt datetime default current_timestamp on update current_timestamp;
alter table orders modify tx_ref varchar(100) unique, modify userEmail varchar(30) unique, modify userPhone varchar(30) unique;

insert into orders(tax,shippingFee,subTotal,total,paymentStatus,deliveryStatus,tx_ref,transaction_id,user,userName,userEmail,userPhone) values(1,1,1242,1244,"successful","delivered","4528853","64da7f068d8d805da34646d0",2,"Nestor Phelip","nphelip0@mapy.cz","+62 (418) 438-2653"),(1,1,1242,1244,"successful","failed","4528753","64da7f9b8d8d805da34647a0",4,"Nestor Phelip","nphelip0@mapy.cz5","+62 (418) 438-26653"),(1,1,1242,1244,"successful","canceled","4928853","64da802e8d8d805da346486f",5,"Nestor Phelip","nphelip0@mapy4.cz","+62 (418) 438-26535");
select * from orders;

-- populate order items table and link it to the order table in a one to many relationship
describe order_items;

alter table order_items modify name varchar(20) after product, modify image varchar(255) after name, modify price dec(10,2) after image, modify amount int after price, modify color varchar(7) after amount ;
-- if a word is reserved, you have to put it in a backtick to be able to use it 
alter table order_items add `order` int;
alter table order_items add constraint foreign key(`order`) references orders(_id) on delete cascade;

select * from order_items;
select * from orders;
 insert into order_items(`order`, product,name,image,price,amount,color) values(7, 2, "delano Egan","https://res.cloudinary.com/dod7yij4e/image/upload/v1689965952/Product%…",1234,1,"#8a2a2a"),(7, 3,
"New product","https://res.cloudinary.com/dod7yij4e/image/upload/v1689254992/Product%…",2000,1,"#d01e1e"),(7,4,"New product",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1689204438/Product%…",6000,1,"#0dbcce"),(8,4,"New product",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1689204438/Product%…",6,1,"#0dbcce"),(9,4,"New product",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1689204438/Product%…",6,1,"#0dbcce"),(8,3,"New product",
"https://res.cloudinary.com/dod7yij4e/image/upload/v1689204438/Product%…",6,1,"#0dbcce");

select * from order_items order by `order` desc;

-- populate the delivery address table and link it to orders in a one to many relationship;

alter table deliveryaddress add `order` int, add constraint foreign key(`order`) references orders(_id) on delete cascade; 
-- you can check the name of a constraint if you dont know it in case you wanna use it 
SELECT constraint_name
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE table_name = 'orders';

select * from deliveryaddress;
alter table deliveryaddress modify country varchar(30);
insert into deliveryaddress(`order`, phone, street, city, state, country ) values(7, "+527038626576","ojueku street","ilorin","kwara","Nigeria"),(9,"+527038626576","ojueku street","ilorin","kwara","Nigeria"),(8,"+527038626576","ojueku street","ilorin","kwara","Nigeria");
 
 -- queries
 select * from products;
 update products set description = "just trying to update this row" where _id = 2;
 select count(_id) as documents from products;
 select * from products where name like "de%";
 select * from products where categoryA = "bracelet";
 select * from products where name like "fa__%" and categoryB = "special offers";
 select * from products where featured = "not available";
 
 -- Retrieve Users with the Latest Verification Timestamp
--  Write a query to retrieve the users who were last verified, along with their verification timestamp.
 select * from users;
 select fullname, created_At, updated_At from users where isVerified = true order by  created_At desc;
 
 -- Find Users with Common Email Domains:
-- Write a query to identify common email domains among users (e.g., gmail.com, yahoo.com).
-- this will make te search case insensitive 
select * from users where lower(email) like "%gmail.com%";
-- calculate the Total Number of Characters in All Passwords:
-- Write a query to calculate the total number of characters in all user passwords combined.

select sum(char_length(password)) as "total_password_length" from users;
-- List Users with Unique Phone Numbers:
-- Write a query to retrieve users who have unique phone numbers (no duplicates).

select distinct(phone) as phone_numbers from users; 
select phone from users;

-- Find the Gender Distribution of Verified Users:
-- Write a query to display the gender distribution among verified users.
-- when using group by whatever column is selected (except agregate func) must also be contained in the group by 
-- any column in the SELECT list that is not part of an aggregate function (like COUNT, SUM, etc.) must be included in the GROUP BY clause.
select gender, count(_id) as count from users where isVerified = 1 group by gender ;

-- Retrieve Users with the Longest Address:
-- Write a query to find users with the longest address.
select * from users order by char_length(address) desc limit 1; 

-- Calculate the Average Age of Users (assuming birthdate is available):
-- If there's a birthdate column, write a query to calculate the average age of users.
-- assuming this column is available 
select avg(birthdate) as average_user_age from users;

-- List Users Who Haven't Updated Their Image:
-- Write a query to retrieve users who haven't updated their profile image.

-- Find Users with Passwords Expiring Soon:
-- If there's a password expiration date, write a query to find users whose passwords are expiring within the next 7 days.
SELECT * FROM users WHERE created_At >= NOW() - INTERVAL 7 DAY;

-- Count the Number of Users for Each Role:
-- Write a query to count the number of users for each role (admin and user).

select count(role) as role from users group by role;


select * from users where not (image = 'https://res.cloudinary.com/dod7yij4e/image/upload/v1688826394/Users%20Avatar/tmp-1-1688826393784_ajygyi.png' and 'https://res.cloudinary.com/dod7yij4e/image/upload/v1688826394/Users%20Avatar/tmp-1-1688826393784_ajygyi.png');

select * from users where image not in ('https://res.cloudinary.com/dod7yij4e/image/upload/v1688826394/Users%20Avatar/tmp-1-1688826393784_ajygyi.png' , 'https://res.cloudinary.com/dod7yij4e/image/upload/v1688826394/Users%20Avatar/tmp-1-1688826393784_ajygyi.png');
 
-- query products table
-- Retrieve Products with the Highest Average Rating:
-- Write a query to retrieve the product name, category, and average rating for products with the highest average rating.
select * from products;
select * from productimages;

select * from products order by averageRating desc limit 1;
-- List Products with No Images:
-- Write a query to retrieve the names of products that have no associated images.

select * from products left outer join productimages on products._id = product where (productimages.image0 is null or productimages.image1 is null or productimages.image2 is null or productimages.image3 is null); 

select * from products left outer join productimages on products._id = product where image0 is not null;
select * from products left outer join productimages on products._id = product;

-- Calculate the Total Inventory Value for Each Category:
-- Write a query to calculate the total value of inventory (price * inventory) for each category.

select categoryA, sum(price * inventory) as "total value" from products group by categoryA;
-- Find Products with Low Inventory (< 10):
-- Write a query to retrieve the names and inventory levels of products with inventory less than 10.

select * from products where inventory < 10 order by inventory desc;
select * from colors;
-- Count the Number of Reviews for Each Category:
-- Write a query to count the total number of reviews for each category.

select categoryA, sum(numOfReviews) as total_reviews from products group by categoryA;
-- Retrieve Products with Multiple Colors:
-- Write a query to retrieve the names of products that have more than one color.

select * from products left join colors on products._id  = colors.product where count(distinct case when color0 is not null then 1 end + case when color1 is not null then 1 end + case when color2 is not null then 3 end + case when color4 is not null then 1 end + case when color5 is not null then 1 end) > 1;
select * from products left join colors on products._id  = colors.product where color0 is not null;
-- Calculate the Average Number of Reviews for Featured Products:
-- Write a query to calculate the average number of reviews for products that are marked as "available" in the featured column.
select featured, avg(numOfReviews) as "average reviews" from products  group by featured;

-- List Products Created in the Last 30 Days:
-- Write a query to retrieve the names and creation dates of products created in the last 30 days.
select * from products;
select * from products where createdAt < now() + interval 30 day; 
-- Update Inventory for Best Sellers:
-- Write a query to update the inventory of products in the "best sellers" category to a specific value (e.g., double the current inventory).
update products set inventory = inventory * 2 where categoryB = "best sellers" and _id > 0; 
-- Delete Products with No Reviews and Low Inventory:
-- Write a query to delete products that have zero reviews and an inventory level less than 5.
delete from products where numOfReviews = 0 and _id > 5;
-- Retrieve Products with Images and Colors:
-- Write a query to retrieve the names of products along with their associated images and colors. Ensure that the query includes products even if -- -- they don't have images or colors.
select * from products left outer join productimages on products._id = productimages.product left outer join colors on products._id = colors.product;
-- Count the Number of Images for Each Product:
-- Write a query to count the number of images for each product, and include products even if they have no images.
-- When using an aggregate function like SUM, you need to include a GROUP BY clause for non-aggregated columns in your SELECT statement.

select name, price, description, sum(case when image0 is not null then 1 else 0 end + case when image1 is not null then 1 else 0 end + case when image2 is not null then 1 else 0 end + case when image3 is not null then 1 else 0 end) as "num of images" from products left outer join productimages on products._id = productimages.product group by name, price, description;

sELECT COUNT(image0) FROM productimages;
select * from productImages;
describe productimages;
update products set name = "silly dragon" where _id = 4;
update productimages set image3 = null where _id = 5;

-- Find Products with the Most Colors:
-- Write a query to find the names of products that have the highest number of associated colors.
select name, sum(case when image0 is not null then 1 else 0 end + case when image1 is not null then 1 else 0 end + case when image2 is not null then 1 else 0 end + case when image3 is not null then 1 else 0 end) as "num of images" from products left outer join productimages on products._id = productimages.product group by name order by `num of images` asc limit 1 ;

-- List Products with No Colors:
-- Write a query to retrieve the names of products that have no associated colors.

select name from products left outer join colors on products._id = colors.product where (color0 is null and color1 is null and color2 is null and color3 is null and color4 is null and color5 is null);
SELECT name
FROM products
LEFT OUTER JOIN colors ON products._id = colors.product
WHERE COALESCE(color0, color1, color2, color3, color4, color5) IS NULL;

-- The COALESCE function in SQL is used to return the first non-NULL expression among its arguments.
SELECT COALESCE(color0,color1,color2,color3,color4) AS result from colors;

-- Calculate the Total Inventory Value Considering Images:
-- Write a query to calculate the total value of inventory (price * inventory) for each product, considering the number of images each product has.

-- Retrieve Products with the Latest Update (Image or Color):
-- Write a query to retrieve the names of products along with the timestamp of their latest update, considering both images and colors.
select * from products left outer join productimages on products._id = productimages.product left outer join colors on colors.product = products._id;
select name, products.createdAt,products.updatedAt from products left outer join productimages on products._id = productimages.product left outer join colors on colors.product = products._id order by products.updatedAt desc limit 10;

-- Count the Total Number of Images in Each Category:
-- Write a query to count the total number of images for each category, considering products even if they have no images.
 select categoryA, sum(case when image0 is not null then 1 else 0 end + case when image1 is not null then 1 else 0 end + case when image2 is not null then 1 else 0 end + case when image3 is not null then 1 else 0 end) as "sum of images in catA" from products left outer join productimages on products._id = productimages.product group by categoryA;
 

-- List Products with More Images Than Colors:
-- Write a query to retrieve the names of products that have more images than colors.
select name, sum(case when image0 is not null then 1 else 0 end + case when image1 is not null then 1 else 0 end + case when image2 is not null then 1 else 0 end + case when image3 is not null then 1 else 0 end) as "sum of images",sum(case when color0 is not null then 1 else 0 end + case when color1 is not null then 1 else 0 end + case when color2 is not null then 1 else 0 end + case when color3 is not null then 1 else 0 end + case when color4 is not null then 1 else 0 end + case when color5 is not null then 1 else 0 end) as "sum of colors"  from products left outer join productimages on products._id = productimages.product left outer join colors on products._id = colors.product where "sum of images" > "sum of colors" group by name;

-- Calculate the Average Inventory Value for Products with Colors:
-- Write a query to calculate the average value of inventory (price * inventory) for products that have associated colors.

select * from products left outer join colors on products._id = colors.product where coalesce(color0, color1, color2, color3, color4, color5) is not null;

select name, price, inventory, sum(price * inventory) as `average value` from products left outer join colors on products._id = colors.product where coalesce(color0, color1, color2, color3, color4, color5) is not null group by price,inventory,name;

select avg(price * inventory) as `average value` from products left outer join colors on products._id = colors.product where coalesce(color0, color1, color2, color3, color4, color5) is not null;


select * from products left outer join colors on products._id = colors.product where coalesce(freeShipping, inventory, color3);

-- COALESCE is used to return the first non-NULL expression among its arguments. It's particularly useful in scenarios where you have multiple values -- and you want to get the first one that is not NULL.

-- Retrieve the total number of orders and the average total amount per order for each user. Display the results in descending order of the average -- total amount.
select * from orders;
select * from orders left outer join users on orders.user = users._id;
select count(orders._id) as 'total number of orders' from orders left outer join users on orders.user = users._id;
select user, count(orders._id) as 'total number of orders', avg(total) as 'average total' from orders left outer join users on orders.user = users._id group by user order by `average total` desc limit 4 ;

-- Find the users who have placed orders with a total amount greater than a specified value. Include the user's name, email, and the total number of -- orders placed.

select users.fullname, users.email, count(orders.total) as `num of orders` from users right outer join orders on users._id = orders.user where orders.total > 124 group by users.fullname, users.email;
SELECT users.fullname, 
       users.email, 
       SUM(1) AS `num of orders` 
FROM users 
RIGHT OUTER JOIN orders ON users._id = orders.user 
WHERE orders.total > 124 
GROUP BY users.fullname, users.email;

-- Calculate the total revenue generated by each product, considering the sum of prices multiplied by the quantity (amount) sold. Display the product -- name and total revenue, and sort the results in descending order of total revenue.
select * from products;
select name, sum(price * numOfTimesSold) as `total revenue` from products group by name order by `total revenue` desc ;

-- Identify the products that have never been ordered. Display the product name and the total number of orders for each product.

select name, numOfTimesSold from products where numOfTimesSold > 0;


-- For each city, determine the average total amount of orders and the count of orders placed. Display the city name, average total amount, and count of orders, sorted by the average total amount in descending order.

select * from deliveryaddress;

select city, count(city) as `city orders` from deliveryaddress group by city order by city desc ;


-- List the users who have placed orders with a delivery status of "delivered" but have not provided a delivery address. Include the user's name, email, and delivery status.

select fullname, email, deliveryStatus from users right outer join orders on users._id = orders.user left outer join deliveryaddress on orders._id = deliveryaddress.order where deliveryStatus = 'delivered' and (coalesce(phone,city,state,street,country) is not null);
select * from users right outer join orders on users._id = orders.user left outer join deliveryaddress on orders._id = deliveryaddress.order;
select * from orders;

-- Find the users who have placed more than one order on the same day. Display the user's name, email, and the count of orders placed on that day.
select * from users right outer join orders on users._id = orders.user;
select fullname, email, user, count(orders.createdAt) as numoforders, orders.createdAt from users right outer join orders on users._id = orders.user group by fullname,email, user,orders.createdAt;

select case when  count(orders.createdAt) > 1 then (select fullname, email, user from users) as users from users right outer join orders on users._id = orders.user group by fullname,email, user;

-- Retrieve the top N users with the highest total amount spent on orders. Include the user's name, email, and the total amount spent, and allow the result to be parameterized for different values of N.

select * from users;
select * from orders;

select fullname, email, total as `total amount spent` from users right outer join orders on users._id = orders.user order by orders.total desc;
SELECT users.fullname, 
       users.email, 
       SUM(orders.total) AS `total amount spent`
FROM users 
RIGHT OUTER JOIN orders ON users._id = orders.user 
GROUP BY users.fullname, users.email
ORDER BY `total amount spent` DESC;

-- Identify the products that have been ordered in quantities greater than the average quantity ordered for all products. Display the product name, average quantity ordered, and actual quantity ordered.

select * from products;
select * from orders;
select * from order_items;

select name, avg(numOfTimesSold) as `avg qty`, numOfTimesSold from products where numOfTimesSold > (select avg(numOfTimesSold) from products) group by name, numOfTimesSold order by numOfTimesSold desc;

SELECT
    p.name AS product_name,
    AVG(p.numOfTimesSold) AS average_quantity_ordered,
    p.numOfTimesSold AS actual_quantity_ordered
FROM
    products p
WHERE
    p.numOfTimesSold > (SELECT AVG(numOfTimesSold) FROM products)
GROUP BY
    p.name, p.numOfTimesSold
ORDER BY
    actual_quantity_ordered DESC;

-- List the orders that have a total amount greater than the average total amount for all orders. Include the order ID, user name, and total amount.
select * from advert;
select * from promotion;
select * from users where fullname like "%a%";
select * from products left outer join colors on products._id = colors.product where color;
delete from users where _id = 26;
alter table users modify password varchar(300) not null;
alter table users add constraint users_chk_2 check(char_length(password) between 6 and 300);
alter table token modify isValid bool default true;
select count(1) as `total` from users;
alter table users change created_At createdAt datetime default current_timestamp on update current_timestamp, change updated_At updatedAt  datetime default current_timestamp on update current_timestamp;
delete from users where _id in (1,2,3,4) ;
alter table advert change updated_at updatedAt datetime default current_timestamp on update current_timestamp;
update advert set advertlink = null where _id > 1;
select * from products left outer join colors on products._id = colors.product where colors.color0 like '%#f31818%' or colors.color1 like '%#f31818%';
alter table products modify inventory int default 0 not null, modify averageRating int default 0 not null, modify numOfReviews int default 0 not null, modify numOfTimesSold int default 0 not null;
select * from products left outer join reviews on products._id = reviews.product;
describe reviews;
select * from products left outer join reviews on products._id = reviews.product where products._id = 5;
select * from reviews where product = 5;
show tables;
SELECT
    products.name AS productName,
    products._id AS productId,
    reviews.rating,
    reviews.comment,
    reviews.title,
    reviews.userId AS userId,
    users.fullname AS userName,
    reviews.createdAt AS reviewCreatedAt,
    reviews.updatedAt AS reviewUpdatedAt,
    orders.createdAt AS orderCreatedAt,
    orders.updatedAt AS orderUpdatedAt,
    deliveryaddress.country,
    deliveryaddress.state
FROM
    deliveryaddress
RIGHT OUTER JOIN orders ON deliveryaddress.orderId = orders._id
RIGHT OUTER JOIN users ON orders.userId = users._id
RIGHT OUTER JOIN reviews ON reviews.userId = users._id
RIGHT OUTER JOIN products ON products._id = reviews.productId
 WHERE 
     products._id = 2;

select * from deliveryaddress right outer join orders on deliveryaddress.order = orders._id right outer join users on orders.user = users._id right outer join reviews on reviews.user = users._id right outer join products on products._id = reviews.product;
alter table reviews change product productId int;

select * from reviews;
select * from products;
show databases;
describe deliveryaddress;
show tables;
