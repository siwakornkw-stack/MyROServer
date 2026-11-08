import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  Activity, CalendarDays, ChevronRight, Download, House, Info, Megaphone, MessageCircle,
  Trophy, UserPlus, UserRound, Users, X, type LucideIcon,
} from 'lucide-react'
import { guilds, news, notice, rankings, server, status, type News } from './data'

type RegisterForm = { userid: string; email: string; password: string; confirm: string; sex: 'M' | 'F' }

const nav: [string, string, LucideIcon][] = [
  ['top', 'หน้าแรก', House],
  ['register', 'สมัครสมาชิก', UserPlus],
  ['download', 'ดาวน์โหลด', Download],
  ['info', 'ข้อมูลเซิร์ฟเวอร์', Info],
  ['ranking', 'อันดับ', Trophy],
]

const tabs: ('ทั้งหมด' | News['tag'])[] = ['ทั้งหมด', 'ข่าว', 'อีเวนต์', 'อัปเดต']
const medals = ['gold', 'silver', 'bronze']

function Register() {
  const [form, setForm] = useState<RegisterForm>({ userid: '', email: '', password: '', confirm: '', sex: 'M' })
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const set = (k: keyof RegisterForm) => (e: { target: { value: string } }) =>
    setForm({ ...form, [k]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) return setResult({ ok: false, msg: 'รหัสผ่านไม่ตรงกัน' })
    setResult(null)
    setBusy(true)
    try {
      const { confirm: _, ...body } = form
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      setResult(res.ok ? { ok: true, msg: 'สมัครสำเร็จ เข้าเกมได้เลย' } : { ok: false, msg: data.error ?? 'สมัครไม่สำเร็จ' })
    } catch {
      setResult({ ok: false, msg: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้' })
    } finally {
      setBusy(false)
    }
  }

  // Same rules as check() in server/index.js; the browser enforces them before submit.
  return (
    <form className="register" onSubmit={submit}>
      <label>ไอดี<input required pattern="[a-zA-Z0-9]{4,23}" title="a-z, 0-9 ยาว 4-23 ตัว" value={form.userid} onChange={set('userid')} /></label>
      <label>อีเมล<input type="email" required maxLength={39} value={form.email} onChange={set('email')} /></label>
      <label>รหัสผ่าน<input type="password" required minLength={6} maxLength={32} value={form.password} onChange={set('password')} /></label>
      <label>ยืนยันรหัสผ่าน<input type="password" required value={form.confirm} onChange={set('confirm')} /></label>
      <label>
        เพศตัวละคร
        <select value={form.sex} onChange={set('sex')}>
          <option value="M">ชาย</option>
          <option value="F">หญิง</option>
        </select>
      </label>
      <button className="btn" disabled={busy}>{busy ? 'กำลังสมัคร...' : 'สร้างไอดี'}</button>
      {result && <p className={result.ok ? 'ok' : 'err'}>{result.msg}</p>}
    </form>
  )
}

function Heading({ en, th, children }: { en: string; th: string; children?: ReactNode }) {
  return (
    <div className="heading">
      <div>
        <h2>{en}</h2>
        <span>{th}</span>
      </div>
      {children}
    </div>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [showNotice, setShowNotice] = useState(true)
  const [tab, setTab] = useState<(typeof tabs)[number]>('ทั้งหมด')
  const [openNews, setOpenNews] = useState<News | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [rankTab, setRankTab] = useState<'player' | 'guild'>('player')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const shown = tab === 'ทั้งหมด' ? news : news.filter(n => n.tag === tab)
  const [head, rows]: [string[], (string | number)[][]] = rankTab === 'player'
    ? [['ชื่อ', 'อาชีพ', 'Base Lv', 'กิลด์'], rankings.map(r => [r.name, r.job, r.baseLv, r.guild])]
    : [['กิลด์', 'หัวหน้า', 'สมาชิก', 'Guild Lv', 'ปราสาท'], guilds.map(g => [g.name, g.master, g.members, g.level, g.castles])]

  return (
    <>
      <header className={scrolled ? 'top solid' : 'top'}>
        <a className="logo" href="#top">{server.name}</a>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <a key={id} href={`#${id}`}><Icon size={16} />{label}</a>
          ))}
          <a href={server.discordUrl}><MessageCircle size={16} />Discord</a>
        </nav>
      </header>

      <a className="float-member" href="#register" aria-label="สมัครสมาชิก">
        <UserRound size={20} /><span>MEMBER</span>
      </a>

      <section className="hero" id="top">
        <div className="nebula" aria-hidden />

        {showNotice && (
          <div className="notice">
            <span className="notice-tag"><Megaphone size={14} />NOTE</span>
            <div className="marquee"><span>{notice}</span></div>
            <button onClick={() => setShowNotice(false)} aria-label="ปิด"><X size={14} /></button>
          </div>
        )}

        <div className="emblem">
          <div className="ring" aria-hidden />
          <h1>{server.name}</h1>
          <small>{server.episode} Episode</small>
        </div>
        <div className="divider" aria-hidden><i /></div>
        <p className="hero-title">RAGNAROK ONLINE</p>
        <p className="hero-sub">{server.tagline}</p>
        <div className="actions">
          <a className="btn" href="#register"><UserPlus size={18} />สมัครสมาชิก</a>
          <a className="btn ghost" href="#download"><Download size={18} />ดาวน์โหลด</a>
        </div>
      </section>

      <main>
        <section className="status-wrap">
          <div className="center-heading">
            <h2><Activity size={20} />SERVER STATUS</h2>
            <span>[ Real Time System Monitor ]</span>
          </div>
          <div className="status-grid">
            <div className="stat">
              <span className="stat-icon"><span className={status.online ? 'dot on' : 'dot'} /></span>
              <div><small>SERVER STATUS</small><b className={status.online ? 'on' : 'off'}>{status.online ? 'ONLINE' : 'OFFLINE'}</b></div>
            </div>
            <div className="stat">
              <span className="stat-icon"><Users size={20} /></span>
              <div><small>PLAYERS ONLINE</small><b>{status.players}<em>users</em></b></div>
            </div>
            <div className="stat">
              <span className="stat-icon"><UserRound size={20} /></span>
              <div><small>CHARACTERS CREATED</small><b>{status.characters.toLocaleString()}</b></div>
            </div>
          </div>
        </section>

        <section id="news" className="panel">
          <Heading en="News Update" th="ข่าวสารอัปเดตเซิร์ฟเวอร์" />
          <div className="tabs">
            {tabs.map(t => (
              <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <ul className="news-list">
            {shown.map(n => (
              <li key={n.title}>
                <button onClick={() => { setOpenNews(n); dialog.current?.showModal() }}>
                  <span className={`tag t-${n.tag}`}>{n.tag}</span>
                  <b>{n.title}</b>
                  <span className="news-body">{n.body}</span>
                  <span className="date"><CalendarDays size={13} />{n.date}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="quick" id="download">
          <a className="quick-card" href="#register">
            <UserPlus size={26} />
            <div><b>REGISTER</b><small>สร้างบัญชีผู้ใช้งาน</small></div>
          </a>
          {server.downloads.map(d => (
            <a key={d.label} className="quick-card" href={d.url}>
              <Download size={26} />
              <div><b>{d.label.toUpperCase()}</b><small>ดาวน์โหลด {d.size}</small></div>
            </a>
          ))}
        </section>

        <section id="info" className="panel">
          <Heading en="Server Info" th="ข้อมูลเซิร์ฟเวอร์" />
          <div className="rates">
            <div><small>EPISODE</small><b>{server.episode}</b></div>
            <div><small>BASE EXP</small><b>{server.rates.base}</b></div>
            <div><small>JOB EXP</small><b>{server.rates.job}</b></div>
            <div><small>DROP</small><b>{server.rates.drop}</b></div>
            <div><small>MAX LEVEL</small><b>{server.maxLevel}</b></div>
          </div>
        </section>

        <section id="ranking" className="panel">
          <Heading en="Ranking" th="อันดับผู้เล่นและกิลด์">
            <div className="tabs inline">
              <button className={rankTab === 'player' ? 'active' : ''} onClick={() => setRankTab('player')}>ผู้เล่น</button>
              <button className={rankTab === 'guild' ? 'active' : ''} onClick={() => setRankTab('guild')}>กิลด์</button>
            </div>
          </Heading>
          <div className="table-wrap">
            <table>
              <thead><tr><th>อันดับ</th>{head.map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {rows.map(([name, ...rest], i) => (
                  <tr key={name}>
                    <td><span className={`rank ${medals[i] ?? ''}`}>{i + 1}</span></td>
                    <td className="name">{name}</td>
                    {rest.map((c, j) => <td key={j}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="register" className="panel">
          <Heading en="Register" th="สมัครสมาชิก" />
          <div className="join">
            <div className="join-info">
              <h3>เริ่มต้นการผจญภัย</h3>
              <ul>
                <li><ChevronRight size={16} />สมัครฟรี ไม่มีค่าใช้จ่าย</li>
                <li><ChevronRight size={16} />Rate {server.rates.base} / {server.rates.job} / {server.rates.drop}</li>
                <li><ChevronRight size={16} />อีเวนต์ทุกสัปดาห์</li>
                <li><ChevronRight size={16} />พูดคุยกับผู้เล่นได้ที่ <a href={server.discordUrl}>Discord</a></li>
              </ul>
            </div>
            <Register />
          </div>
        </section>
      </main>

      <dialog ref={dialog} className="modal" aria-label={openNews?.title} onClick={e => e.target === e.currentTarget && dialog.current?.close()}>
        {openNews && (
          <article>
            <button className="modal-x" onClick={() => dialog.current?.close()} aria-label="ปิด"><X size={18} /></button>
            <div className="meta">
              <span className={`tag t-${openNews.tag}`}>{openNews.tag}</span>
              <span className="date"><CalendarDays size={13} />{openNews.date}</span>
            </div>
            <h3>{openNews.title}</h3>
            <p>{openNews.body}</p>
          </article>
        )}
      </dialog>

      <footer>
        <div className="foot">
          <div>
            <a className="logo" href="#top">{server.name}</a>
            <p>{server.tagline}</p>
          </div>
          <div>
            <h4>QUICK LINKS <i>//</i></h4>
            {nav.slice(1).map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </div>
          <div>
            <h4>CONTACT <i>//</i></h4>
            <a href={server.discordUrl}>Discord</a>
          </div>
        </div>
        <p className="copy">Fan-made private server. Ragnarok Online is a trademark of Gravity Co., Ltd.</p>
      </footer>
    </>
  )
}
