import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Users,
  Trophy,
  Calendar,
  ChevronRight,
  Phone,
  Star
} from "lucide-react";

// Branch data
const branches = [
  { name: "แจ้งวัฒนะ", coaches: 4 },
  { name: "พระราม 2", coaches: 3 },
  { name: "รามอินทรา", coaches: 4 },
  { name: "สุวรรณภูมิ", coaches: 2 },
  { name: "เทพารักษ์", coaches: 3 },
  { name: "รัชดา", coaches: 1 },
  { name: "ราชพฤกษ์-ตลิ่งชัน", coaches: 1 },
];

// Features data
const features = [
  {
    icon: Trophy,
    title: "60 Levels",
    description: "หลักสูตรครบ 60 Level ตั้งแต่พื้นฐานจนถึงระดับนักกีฬาทีมชาติ",
  },
  {
    icon: Users,
    title: "โค้ชมืออาชีพ",
    description: "ทีมโค้ชผู้เชี่ยวชาญ ดูแลนักเรียนอัตราส่วน 1:4",
  },
  {
    icon: Calendar,
    title: "ตารางยืดหยุ่น",
    description: "เลือกวันเรียนได้สูงสุด 10 ครั้ง/สัปดาห์ พร้อมสลับวันได้",
  },
  {
    icon: MapPin,
    title: "7 สาขาทั่วกรุงเทพ",
    description: "สะดวกเลือกสาขาใกล้บ้าน ครอบคลุมทุกพื้นที่",
  },
];

// Pricing data
const pricingTiers = [
  { sessions: "1 ครั้ง", price: "700", perSession: "700", popular: false },
  { sessions: "4 ครั้ง/เดือน", price: "2,500", perSession: "625", popular: false },
  { sessions: "8 ครั้ง/เดือน", price: "4,000", perSession: "500", popular: true },
  { sessions: "12 ครั้ง/เดือน", price: "5,200", perSession: "433", popular: false },
  { sessions: "16 ครั้ง/เดือน", price: "6,500", perSession: "406", popular: false },
  { sessions: "19+ ครั้ง/เดือน", price: "7,000", perSession: "350", popular: false },
];

// Level tiers
const levelTiers = [
  { emoji: "👶", levels: "1-29", name: "ชุดพื้นฐาน", desc: "ฝึกวิธีการรับลูกจากคู่แข่ง" },
  { emoji: "🔨", levels: "30-39", name: "ชุดนักกีฬา", desc: "ฝึกวิธีการตีลูกทำแต้ม" },
  { emoji: "🧠", levels: "40-43", name: "ชุดนักกีฬา+", desc: "ฝึกวิสัยทัศน์การเล่นเกม" },
  { emoji: "💪", levels: "44-60", name: "ชุดขั้นสูง", desc: "เทคนิคระดับทีมชาติ" },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Navigation */}
      <nav className="glass" style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "0 24px"
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 70
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image
              src="/logo.jpg"
              alt="New Athlete Logo"
              width={48}
              height={48}
              style={{ borderRadius: 8 }}
            />
            <span style={{ fontSize: 20, fontWeight: 700 }} className="gradient-text">
              New Athlete
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link href="#features" style={{ color: "var(--foreground-muted)" }}>
              หลักสูตร
            </Link>
            <Link href="#branches" style={{ color: "var(--foreground-muted)" }}>
              สาขา
            </Link>
            <Link href="#pricing" style={{ color: "var(--foreground-muted)" }}>
              ค่าเรียน
            </Link>
            <Link href="/login" className="btn-secondary" style={{ padding: "10px 20px" }}>
              เข้าสู่ระบบ
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: "10px 20px" }}>
              ลงทะเบียน
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: 140,
        paddingBottom: 80,
        background: "linear-gradient(180deg, rgba(0,212,255,0.05) 0%, transparent 50%)"
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="badge" style={{ marginBottom: 24 }}>
            <Star size={16} style={{ color: "var(--warning)" }} />
            <span>สโมสรแบดมินตันอันดับ 1</span>
          </div>

          <h1 style={{ fontSize: 56, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            <span className="gradient-text">New Athlete</span>
          </h1>
          <h2 style={{ fontSize: 48, fontWeight: 700, marginBottom: 24, color: "var(--foreground)" }}>
            Badminton Academy
          </h2>

          <p style={{
            fontSize: 18,
            color: "var(--foreground-muted)",
            maxWidth: 600,
            margin: "0 auto 40px",
            lineHeight: 1.8
          }}>
            พัฒนาทักษะแบดมินตันอย่างเป็นระบบ ตั้งแต่พื้นฐานจนถึงระดับนักกีฬา
            ด้วยหลักสูตร 60 Level และทีมโค้ชมืออาชีพ
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 60 }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 18, padding: "16px 32px" }}>
              ทดลองเรียนฟรี
              <ChevronRight size={20} />
            </Link>
            <a href="tel:0812345678" className="btn-secondary" style={{ fontSize: 18, padding: "16px 32px" }}>
              <Phone size={20} />
              ติดต่อเรา
            </a>
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ maxWidth: 800, margin: "0 auto" }}>
            {[
              { value: "7", label: "สาขา" },
              { value: "60", label: "Levels" },
              { value: "18+", label: "โค้ช" },
              { value: "500+", label: "นักเรียน" },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
              ทำไมต้อง <span className="gradient-text">New Athlete</span>
            </h2>
            <p style={{ fontSize: 18, color: "var(--foreground-muted)" }}>
              เราพัฒนาทักษะแบดมินตันของคุณอย่างเป็นระบบ
            </p>
          </div>

          <div className="grid-4">
            {features.map((feature, i) => (
              <div key={i} className="card">
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "rgba(0,212,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16
                }}>
                  <feature.icon size={28} style={{ color: "var(--primary)" }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--foreground-muted)", lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Level Tiers Section */}
      <section style={{ padding: "80px 0", background: "var(--background-card)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
              หลักสูตร <span className="gradient-text">60 Levels</span>
            </h2>
            <p style={{ fontSize: 18, color: "var(--foreground-muted)" }}>
              พัฒนาทักษะตามลำดับขั้น จากพื้นฐานสู่ระดับนักกีฬา
            </p>
          </div>

          <div className="grid-4">
            {levelTiers.map((tier, i) => (
              <div key={i} className="level-card">
                <div className="level-emoji">{tier.emoji}</div>
                <div className="level-range">Level {tier.levels}</div>
                <div className="level-name">{tier.name}</div>
                <div className="level-desc">{tier.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
              <span className="gradient-text">7 สาขา</span> ทั่วกรุงเทพ
            </h2>
            <p style={{ fontSize: 18, color: "var(--foreground-muted)" }}>
              เลือกสาขาที่สะดวกใกล้บ้านคุณ
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            maxWidth: 900,
            margin: "0 auto"
          }}>
            {branches.map((branch, i) => (
              <div key={i} className="branch-item">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <MapPin size={20} style={{ color: "var(--primary)" }} />
                  <span style={{ fontWeight: 500 }}>{branch.name}</span>
                </div>
                <span style={{ fontSize: 14, color: "var(--foreground-muted)" }}>
                  {branch.coaches} โค้ช
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: "80px 0", background: "var(--background-card)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
              ค่าเรียน<span className="gradient-text">ที่คุ้มค่า</span>
            </h2>
            <p style={{ fontSize: 18, color: "var(--foreground-muted)" }}>
              ยิ่งเรียนมาก ยิ่งคุ้ม! เลือกแพ็คเกจที่เหมาะกับคุณ
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            maxWidth: 1000,
            margin: "0 auto"
          }}>
            {pricingTiers.map((tier, i) => (
              <div key={i} className={`pricing-card ${tier.popular ? 'popular' : ''}`}>
                {tier.popular && <div className="popular-tag">ยอดนิยม</div>}
                <div style={{ fontSize: 14, color: "var(--foreground-muted)", marginBottom: 16 }}>
                  {tier.sessions}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span className="price-currency">฿</span>
                  <span className="price">{tier.price}</span>
                </div>
                <div style={{ fontSize: 14, color: "var(--foreground-muted)", marginBottom: 24 }}>
                  เฉลี่ย ฿{tier.perSession}/ครั้ง
                </div>
                <Link
                  href="/register"
                  className={tier.popular ? "btn-primary" : "btn-secondary"}
                  style={{ width: "100%", justifyContent: "center", padding: "12px 20px" }}
                >
                  เริ่มเรียน
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card" style={{
            textAlign: "center",
            padding: 60,
            background: "linear-gradient(180deg, var(--background-elevated) 0%, var(--background-card) 100%)",
            borderColor: "var(--primary)",
            maxWidth: 800,
            margin: "0 auto"
          }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
              พร้อมเริ่มต้นกับ <span className="gradient-text">New Athlete</span> แล้วหรือยัง?
            </h2>
            <p style={{ fontSize: 18, color: "var(--foreground-muted)", marginBottom: 32 }}>
              ทดลองเรียนฟรี 1 ครั้ง! สมัครวันนี้เพื่อค้นพบศักยภาพแบดมินตันของคุณ
            </p>
            <Link href="/register" className="btn-primary" style={{ fontSize: 18, padding: "16px 40px" }}>
              สมัครทดลองเรียนฟรี
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "40px 0",
        borderTop: "1px solid var(--border)",
        background: "var(--background)"
      }}>
        <div className="container">
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Image
                src="/logo.jpg"
                alt="New Athlete Logo"
                width={40}
                height={40}
                style={{ borderRadius: 8 }}
              />
              <span style={{ fontWeight: 700 }} className="gradient-text">
                New Athlete Academy
              </span>
            </div>
            <div style={{ fontSize: 14, color: "var(--foreground-muted)" }}>
              © 2026 New Athlete Badminton Academy. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
