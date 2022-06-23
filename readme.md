<p>1.clone repo ใช้ คำสั่ง git clone https://github.com/ToEzBit/dev-cat-backend</p>
<p>2.เปิดโปรเจคใน vs cod พิมพ์คำสั่ง npm i ใน teminal</p>
<p>3.เข้าไปที่โฟลเดอร์ config และเข้าไฟล์ config.json เปลี่ยน password เป็นของ database ของเครื่องตัวเอง</p>
<p>4.พิมพ์คำสั่ง npx sequelize-cli db:create ใน terminal เพื่อสร้าง data base ในเครื่องตัวเอง แล้วเช็คที่ mysql workbench จะเห็น data base ชื่อ dev_cat_database</p>
<p>5.พิมพ์คำสั่ง npx sequelize-cli db:migrate เพื่อ run migrate ไฟล์ เพื่อสร้าง table ใน data base แล้วเช็คที่ mysql workbench จะเห็น table ถูกสร้างขึ้นมา</p>
<p>6.พิมพ์คำสั่ง npm start เพื่อสั่ง start sever</p>
