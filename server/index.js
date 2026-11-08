import express from 'express'
import mysql from 'mysql2/promise'
import { createHash } from 'node:crypto'

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
})
const useMd5 = process.env.USE_MD5 === 'yes' // must match use_MD5_passwords in conf/login_athena.conf

// Simple per-IP limit: 5 registrations per hour.
const hits = new Map()
function limited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter(t => now - t < 3600_000)
  hits.set(ip, [...recent, now])
  return recent.length >= 5
}

// Server-side rules are the real gate; the frontend check is only for UX.
function check({ userid, email, password, sex }) {
  if (typeof userid !== 'string' || !/^[a-zA-Z0-9]{4,23}$/.test(userid)) return 'ไอดีต้องเป็น a-z, 0-9 ยาว 4-23 ตัว'
  if (typeof password !== 'string' || password.length < 6 || password.length > 32) return 'รหัสผ่านต้องยาว 6-32 ตัว'
  if (typeof email !== 'string' || email.length > 39 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'อีเมลไม่ถูกต้อง'
  if (sex !== 'M' && sex !== 'F') return 'เพศไม่ถูกต้อง'
  return null
}

const app = express()
app.use(express.json())

app.post('/api/register', async (req, res) => {
  if (limited(req.ip)) return res.status(429).json({ error: 'สมัครบ่อยเกินไป ลองใหม่ภายหลัง' })

  const error = check(req.body ?? {})
  if (error) return res.status(400).json({ error })

  const { userid, email, password, sex } = req.body
  try {
    const [rows] = await db.query('SELECT 1 FROM login WHERE userid = ? LIMIT 1', [userid])
    if (rows.length) return res.status(409).json({ error: 'ไอดีนี้ถูกใช้แล้ว' })

    const pass = useMd5 ? createHash('md5').update(password).digest('hex') : password
    await db.query('INSERT INTO login (userid, user_pass, sex, email) VALUES (?, ?, ?, ?)', [userid, pass, sex, email])
    res.status(201).json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'เซิร์ฟเวอร์ผิดพลาด' })
  }
})

const port = Number(process.env.PORT || 3001)
app.listen(port, () => console.log(`API on http://localhost:${port}`))
