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

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="New Athlete Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span className="text-xl font-bold gradient-text">New Athlete</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-foreground-muted hover:text-primary transition-colors">
                หลักสูตร
              </a>
              <a href="#branches" className="text-foreground-muted hover:text-primary transition-colors">
                สาขา
              </a>
              <a href="#pricing" className="text-foreground-muted hover:text-primary transition-colors">
                ค่าเรียน
              </a>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-primary text-background font-medium hover:bg-primary-light transition-colors"
              >
                ลงทะเบียน
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm mb-6">
            <Star className="w-4 h-4 text-warning" />
            <span className="text-foreground-muted">สโมสรแบดมินตันอันดับ 1</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">New Athlete</span>
            <br />
            <span className="text-foreground">Badminton Academy</span>
          </h1>

          <p className="text-xl text-foreground-muted max-w-2xl mx-auto mb-10">
            พัฒนาทักษะแบดมินตันอย่างเป็นระบบ ตั้งแต่พื้นฐานจนถึงระดับนักกีฬา
            <br />
            ด้วยหลักสูตร 60 Level และทีมโค้ชมืออาชีพ
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-background font-semibold text-lg hover:bg-primary-light transition-all transform hover:scale-105 glow"
            >
              ทดลองเรียนฟรี
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:0812345678"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass text-foreground font-semibold text-lg hover:bg-background-elevated transition-colors"
            >
              <Phone className="w-5 h-5" />
              ติดต่อเรา
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { value: "7", label: "สาขา" },
              { value: "60", label: "Levels" },
              { value: "18+", label: "โค้ช" },
              { value: "500+", label: "นักเรียน" },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl glass">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-foreground-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ทำไมต้อง <span className="gradient-text">New Athlete</span>
            </h2>
            <p className="text-foreground-muted text-lg">
              เราพัฒนาทักษะแบดมินตันของคุณอย่างเป็นระบบ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl glass hover:bg-background-elevated transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Level Tiers Section */}
      <section className="py-20 px-4 bg-background-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              หลักสูตร <span className="gradient-text">60 Levels</span>
            </h2>
            <p className="text-foreground-muted text-lg">
              พัฒนาทักษะตามลำดับขั้น จากพื้นฐานสู่ระดับนักกีฬา
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "👶", levels: "1-29", name: "ชุดพื้นฐาน", desc: "ฝึกวิธีการรับลูกจากคู่แข่ง", color: "from-green-500 to-emerald-500" },
              { emoji: "🔨", levels: "30-39", name: "ชุดนักกีฬา", desc: "ฝึกวิธีการตีลูกทำแต้ม", color: "from-blue-500 to-cyan-500" },
              { emoji: "🧠", levels: "40-43", name: "ชุดนักกีฬา+", desc: "ฝึกวิสัยทัศน์การเล่นเกม", color: "from-purple-500 to-violet-500" },
              { emoji: "💪", levels: "44-60", name: "ชุดขั้นสูง", desc: "เทคนิคระดับทีมชาติ", color: "from-amber-500 to-orange-500" },
            ].map((tier, i) => (
              <div key={i} className="relative p-6 rounded-2xl glass overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <div className="text-5xl mb-4">{tier.emoji}</div>
                  <div className="text-sm font-medium text-foreground-muted mb-1">
                    Level {tier.levels}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <p className="text-foreground-muted text-sm">{tier.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">7 สาขา</span> ทั่วกรุงเทพ
            </h2>
            <p className="text-foreground-muted text-lg">
              เลือกสาขาที่สะดวกใกล้บ้านคุณ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {branches.map((branch, i) => (
              <div
                key={i}
                className="p-5 rounded-xl glass hover:bg-background-elevated transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">{branch.name}</span>
                </div>
                <div className="text-sm text-foreground-muted">
                  {branch.coaches} โค้ช
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-background-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ค่าเรียน<span className="gradient-text">ที่คุ้มค่า</span>
            </h2>
            <p className="text-foreground-muted text-lg">
              ยิ่งเรียนมาก ยิ่งคุ้ม! เลือกแพ็คเกจที่เหมาะกับคุณ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-2xl ${tier.popular
                    ? 'gradient-border bg-background-elevated'
                    : 'glass'
                  } hover:scale-105 transition-transform`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-background text-sm font-medium">
                    ยอดนิยม
                  </div>
                )}
                <div className="text-foreground-muted mb-2">{tier.sessions}</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold gradient-text">฿{tier.price}</span>
                  <span className="text-foreground-muted">/เดือน</span>
                </div>
                <div className="text-sm text-foreground-muted mb-6">
                  เฉลี่ย ฿{tier.perSession}/ครั้ง
                </div>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-xl font-medium transition-colors ${tier.popular
                      ? 'bg-primary text-background hover:bg-primary-light'
                      : 'bg-background-card hover:bg-background-elevated text-foreground'
                    }`}
                >
                  เริ่มเรียน
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl gradient-border bg-background-card">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              พร้อมเริ่มต้นกับ <span className="gradient-text">New Athlete</span> แล้วหรือยัง?
            </h2>
            <p className="text-foreground-muted text-lg mb-8">
              ทดลองเรียนฟรี 1 ครั้ง! สมัครวันนี้เพื่อค้นพบศักยภาพแบดมินตันของคุณ
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-background font-semibold text-lg hover:bg-primary-light transition-all transform hover:scale-105 glow"
            >
              สมัครทดลองเรียนฟรี
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="New Athlete Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold gradient-text">New Athlete Academy</span>
            </div>
            <div className="text-foreground-muted text-sm">
              © 2026 New Athlete Badminton Academy. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
