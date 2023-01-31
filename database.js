import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()


const pool = mysql
  .createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306,
  })
  .promise()

  export async function getImages() {
  let query = `
  SELECT * 
  FROM images
  ORDER BY created DESC
  `

  const [rows] = await pool.query(query);
  return rows
}
//exports.getImages = getImages

export async function getImage(id) {
  let query = `
  SELECT * 
  FROM images
  WHERE id = ?
  `

  const [rows] = await pool.query(query, [id]);
  const result = rows[0];
  return result
}
//exports.getImage = getImage

export async function addImage(file_name, description) {
  let query = `
  INSERT INTO images (file_name, description)
  VALUES(?, ?)
  `

  const [result] = await pool.query(query, [file_name, description]);
  const id = result.insertId

  return await getImage(id)
}

//exports.addImage = addImage
export async function deleteImage(id) {
  const [result] = await pool.query(`
  DELETE FROM images
  WHERE id = ?
  `, [id])
  return result
  
}
