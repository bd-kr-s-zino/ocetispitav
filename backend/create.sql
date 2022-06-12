CREATE DATABASE Equipment;
USE Equipment;
 
CREATE TABLE IF NOT EXISTS category (
 category_id INT AUTO_INCREMENT PRIMARY KEY,
 category_name VARCHAR(30) UNIQUE NOT NULL
);
 
CREATE TABLE IF NOT EXISTS characteristics (
 charact_id INT AUTO_INCREMENT PRIMARY KEY,
 charact VARCHAR(400) UNIQUE NOT NULL
);
 
CREATE TABLE IF NOT EXISTS supplier (
 supplier_id INT AUTO_INCREMENT PRIMARY KEY,
 supplier_name VARCHAR(50) UNIQUE NOT NULL,
 supplier_pn VARCHAR(15) UNIQUE NOT NULL,
 email VARCHAR(50) UNIQUE NOT NULL
);
 
CREATE TABLE IF NOT EXISTS worker (
 worker_id INT AUTO_INCREMENT PRIMARY KEY,
 worker_name VARCHAR(50) NOT NULL,
 worker_pn VARCHAR(15) UNIQUE NOT NULL,
 worker_address VARCHAR(75) NOT NULL
);
 
CREATE TABLE IF NOT EXISTS equipment (
 equip_id INT AUTO_INCREMENT PRIMARY KEY,
 equip_name VARCHAR(120) UNIQUE NOT NULL,
 equip_diff VARCHAR(100) UNIQUE NOT NULL,
 category_id INT NOT NULL,
 charact_id INT NOT NULL,
 FOREIGN KEY (category_id) REFERENCES category (category_id),
 FOREIGN KEY (charact_id) REFERENCES characteristics (charact_id)
);
 
CREATE TABLE IF NOT EXISTS purchase (
 purchase_id INT AUTO_INCREMENT PRIMARY KEY,
 equip_id INT NOT NULL,
 cost INT NOT NULL,
 purchase_date DATE NOT NULL,
 supplier_id INT NOT NULL,
 FOREIGN KEY (equip_id) REFERENCES equipment (equip_id),
 FOREIGN KEY (supplier_id) REFERENCES supplier (supplier_id)
);
 
CREATE TABLE IF NOT EXISTS work_contract (
 contract_id INT AUTO_INCREMENT PRIMARY KEY,
 contract_date DATE NOT NULL,
 expire_date DATE NOT NULL,
 responsibility VARCHAR(255) NOT NULL,
 worker_id INT NOT NULL,
 FOREIGN KEY (worker_id) REFERENCES worker (worker_id)
);
 
CREATE TABLE IF NOT EXISTS repairment (
 repair_id INT AUTO_INCREMENT PRIMARY KEY,
 issue VARCHAR(255) NOT NULL,
 fact_start DATE NOT NULL,
 plan_end DATE NOT NULL,
 fact_end DATE,
 equip_id INT NOT NULL,
 FOREIGN KEY (equip_id) REFERENCES equipment (equip_id)
);
 
CREATE TABLE IF NOT EXISTS pin (
 pin_id INT AUTO_INCREMENT PRIMARY KEY,
 pin_start DATE NOT NULL,
 pin_end DATE,
 equip_id INT NOT NULL,
 worker_id INT NOT NULL,
 FOREIGN KEY (equip_id) REFERENCES equipment (equip_id),
 FOREIGN KEY (worker_id) REFERENCES worker (worker_id)
);

CREATE TABLE IF NOT EXISTS users (
 usersID INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(20) NOT NULL UNIQUE,
 password VARCHAR(20) NOT NULL,
 access VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS journal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  user VARCHAR(50) NOT NULL,
  DATE TIMESTAMP NOT NULL
);

INSERT INTO category (category_name) VALUES ('Фрезерні верстати');
INSERT INTO category (category_name) VALUES ('Обробка пластику та гуми');
INSERT INTO category (category_name) VALUES ('Ковально-пресове обладнання');
INSERT INTO category (category_name) VALUES ('Рихтування металу');
INSERT INTO category (category_name) VALUES ('Виробництво та прокладка труб');

INSERT INTO worker (worker_name, worker_pn, worker_address) VALUES ("Гаврилов Олексій Андрійович", "+380986001223", "м. Одеса, вул. Корсунська, б. 5");
 
INSERT INTO worker (worker_name, worker_pn, worker_address) VALUES ("Джавелін Данило Володимирович", "+380966995122", "м. Київ, вул. Залізнична, б. 5");
 
INSERT INTO worker (worker_name, worker_pn, worker_address) VALUES ("Нападовський Андрій Олегович", "+380673564567", "м. Одеса, вул. Марсельська, б. 31");
 
INSERT INTO worker (worker_name, worker_pn, worker_address) VALUES ("Шувекович Григорій Степанович", "+380670913491", "м. Одеса, вул. Маріупольська, б. 2, кв. 92");
 
INSERT INTO worker (worker_name, worker_pn, worker_address) VALUES ("Островська Дарія Сергіївна", "+380934569102", "м. Вінниця, вул. Козятинська, б. 5");
 
INSERT INTO work_contract (contract_date, expire_date, responsibility, worker_id) VALUES ('2021-08-25', '2021-11-25', 'Головний по цеху. Слідкує за виконанням обов`язків іншими робітниками', 1);
 
INSERT INTO work_contract (contract_date, expire_date, responsibility, worker_id) VALUES ('2021-08-29', '2021-11-29', 'Робота за устаткуванням', 2);
 
INSERT INTO work_contract (contract_date, expire_date, responsibility, worker_id) VALUES ('2021-08-29', '2021-11-29', 'Робота за устаткуванням', 3);
 
INSERT INTO work_contract (contract_date, expire_date, responsibility, worker_id) VALUES ('2021-08-29', '2021-11-29', 'Робота за устаткуванням', 4);
 
INSERT INTO work_contract (contract_date, expire_date, responsibility, worker_id) VALUES ('2021-08-31', '2021-11-30', 'Молодший спеціаліст. Проходить стажування за устаткуванням', 5);
 
INSERT INTO work_contract (contract_date, expire_date, responsibility, worker_id) VALUES ('2021-12-01', '2022-05-01', 'Робота за устаткуванням та навчання робітників, що стажуються', 5);
 
INSERT INTO work_contract (contract_date, expire_date, responsibility, worker_id) VALUES ('2021-11-26', '2022-11-26', 'Головний по цеху. Слідкує за виконанням обов`язків іншими робітниками', 1);
 
INSERT INTO supplier (supplier_name, supplier_pn, email) VALUES ("ТОВ Устат-Україна", "+380671294357", "ustatukr@ukr.net");
 
INSERT INTO supplier (supplier_name, supplier_pn, email) VALUES ("ТОВ Пром-ЮА", "+380939462954", "promua@prom.ua");

INSERT INTO characteristics (charact) VALUES ('Країна: Китай;Управління: Напівавтоматичне; Продуктивність: 1300шт/год;Мін. обсяг тари: 0.1л;Макс. обсяг тари: 8л;Охолодження: Водяне')
 
INSERT INTO characteristics (charact) VALUES ('Режим роботи: Автоматичний;Призначення: подрібнення пластмаси, деревних відходів і полімерів')
 
INSERT INTO characteristics (charact) VALUES ('Тип верстата: гільйотина')
 
INSERT INTO characteristics (charact) VALUES ('Макс. ширина листа: 305мм; Макс. товщина листа: 0.8мм; Мін. діаметр вигину: 40мм;')
INSERT INTO equipment (equip_name, equip_diff, category_id, charact_id) VALUES ( 'Напівавтомат видуву пет тари', '', 2, 1);
INSERT INTO equipment (equip_name, equip_diff, category_id, charact_id) VALUES ( 'Подрібнювач пластику GRINDEX-7', 'б/в устаткування', 2, 2);
INSERT INTO equipment (equip_name, equip_diff, category_id, charact_id) VALUES ( 'Подрібнювач пластику GRINDEX-4', '', 2, 2);
 
INSERT INTO equipment (equip_name, equip_diff, category_id, charact_id) VALUES ( 'Гільйотина електромеханічна ACL Q11 3x1300', '', 3, 3);
 
INSERT INTO equipment (equip_name, equip_diff, category_id, charact_id) VALUES ( 'Настільні вальці Metallkraft RBM 305', '', 4, 4);
 
INSERT INTO equipment (equip_name, equip_diff, category_id, charact_id) VALUES ( 'Фрезерувальний верстат з ЧПУ X-cutter Start 750x550', '', 1, NULL);
 
INSERT INTO purchase (equip_id, cost, purchase_date, supplier_id)
VALUES (1, 300000, '2021-07-30', 2);
 
INSERT INTO purchase (equip_id, cost, purchase_date, supplier_id)
VALUES (2, 106200, '2021-07-30', 1);
 
INSERT INTO purchase (equip_id, cost, purchase_date, supplier_id)
VALUES (4, 70340, '2021-07-30', 1);
 
INSERT INTO purchase (equip_id, cost, purchase_date, supplier_id)
VALUES (5, 169203, '2022-01-24', 2);
 
INSERT INTO purchase (equip_id, cost, purchase_date, supplier_id)
VALUES (6, 7600, '2022-01-24', 2);
 
INSERT INTO purchase (equip_id, cost, purchase_date, supplier_id)
VALUES (7, 39500, '2022-01-24', 1);
INSERT INTO repairment (issue, fact_start, plan_end, fact_end, equip_id) VALUES ('Зламався механізм для видуву', '2021-09-30', '2021-10-10', '2021-10-5', 1);
 
INSERT INTO repairment (issue, fact_start, plan_end, equip_id) VALUES ('Зламався приймач пластику', '2021-12-03', '2021-12-20', 1);
INSERT INTO pin (pin_start, pin_end, equip_id, worker_id) VALUES ('2021-08-29', '2021-11-29', 2, 2);
 
INSERT INTO pin (pin_start, pin_end, equip_id, worker_id) VALUES ('2021-08-29', '2021-11-29', 6, 2);
 
INSERT INTO pin (pin_start, pin_end, equip_id, worker_id) VALUES ('2021-08-29', '2021-11-29', 4, 3);
 
INSERT INTO pin (pin_start, pin_end, equip_id, worker_id) VALUES ('2021-08-29', '2021-11-29', 7, 2);
 
INSERT INTO pin (pin_start, pin_end, equip_id, worker_id) VALUES ('2021-08-29', '2021-11-29', 5, 4);
INSERT INTO pin (pin_start, equip_id, worker_id) VALUES ('2021-12-01', 5, 4);
<<<<<<< HEAD

INSERT INTO users (name, password, access) VALUES ('mxclfld', 'password', 'admin');
INSERT INTO users (name, password, access) VALUES ('nitrot', '123456', 'worker');
INSERT INTO users (name, password, access) VALUES ('xerjfx', 'work123', 'worker');
=======
>>>>>>> b80dbb725629c4079722cf3146b7422f96d73f93
