// Edit these to match your server.
export const server = {
  name: 'My RO Server',
  tagline: 'Private server สำหรับคนรักเกม Ragnarok Online',
  episode: 'Renewal',
  rates: { base: 'x10', job: 'x10', drop: 'x5' },
  maxLevel: '175 / 60',
  discordUrl: '#',
  downloads: [
    { label: 'Full Client', size: '4.2 GB', url: '#' },
    { label: 'Patch ล่าสุด', size: '120 MB', url: '#' },
  ],
}

// Mock data. Replace with API calls to your server backend (rAthena DB).
export type News = { date: string; tag: 'ข่าว' | 'อีเวนต์' | 'อัปเดต'; title: string; body: string }
export type Ranker = { name: string; job: string; baseLv: number; guild: string }

export const news: News[] = [
  { date: '2026-11-08', tag: 'ข่าว', title: 'เปิด Open Beta', body: 'เซิร์ฟเวอร์เปิดให้เล่นแล้ว สมัครไอดีและดาวน์โหลดไคลเอนต์ได้เลย' },
  { date: '2026-11-05', tag: 'อีเวนต์', title: 'Double EXP สุดสัปดาห์', body: 'รับ EXP x2 ทุกเสาร์-อาทิตย์ตลอดเดือนนี้' },
  { date: '2026-11-01', tag: 'อัปเดต', title: 'แพตช์ 1.0.3', body: 'ปรับสมดุลสกิลและแก้บั๊กเควสต์' },
  { date: '2026-10-28', tag: 'อัปเดต', title: 'ระบบ Pet Evolution', body: 'เพิ่มระบบวิวัฒนาการสัตว์เลี้ยง' },
  { date: '2026-10-25', tag: 'อีเวนต์', title: 'Halloween Event', body: 'ล่ามอนสเตอร์ฟักทอง รับของรางวัลพิเศษ' },
]

export const rankings: Ranker[] = [
  { name: 'Aster', job: 'Arch Bishop', baseLv: 175, guild: 'Valkyrie' },
  { name: 'Kuro', job: 'Guillotine Cross', baseLv: 174, guild: 'Shadow' },
  { name: 'Mira', job: 'Warlock', baseLv: 172, guild: 'Valkyrie' },
  { name: 'Tora', job: 'Royal Guard', baseLv: 170, guild: 'Ironwall' },
  { name: 'Nami', job: 'Sorcerer', baseLv: 169, guild: '-' },
]

export type Guild = { name: string; master: string; members: number; level: number; castles: number }

export const guilds: Guild[] = [
  { name: 'Valkyrie', master: 'Aster', members: 48, level: 50, castles: 2 },
  { name: 'Shadow', master: 'Kuro', members: 41, level: 47, castles: 1 },
  { name: 'Ironwall', master: 'Tora', members: 35, level: 44, castles: 1 },
  { name: 'Moonlight', master: 'Lune', members: 27, level: 38, castles: 0 },
  { name: 'Phoenix', master: 'Rai', members: 22, level: 35, castles: 0 },
]

export const status = { online: true, players: 128, characters: 2450 }

export const notice = 'ยินดีต้อนรับสู่ Open Beta - Double EXP ทุกเสาร์-อาทิตย์ตลอดเดือนนี้'
