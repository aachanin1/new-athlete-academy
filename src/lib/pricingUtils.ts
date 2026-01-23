// =====================================================
// Pricing Utility Functions - Course Type Support
// =====================================================

export type CourseType = 'kids' | 'adults';

export interface PricingTier {
    price: number;
    tier: string;
    perSession: number;
    minSessions: number;
    maxSessions: number | null;
}

// Kids Pricing Tiers
export const KIDS_PRICING_TIERS: PricingTier[] = [
    { minSessions: 1, maxSessions: 1, price: 700, tier: "รายครั้ง", perSession: 700 },
    { minSessions: 2, maxSessions: 6, price: 2500, tier: "Course 4", perSession: 625 },
    { minSessions: 7, maxSessions: 10, price: 4000, tier: "Course 8", perSession: 500 },
    { minSessions: 11, maxSessions: 14, price: 5200, tier: "Course 12", perSession: 433 },
    { minSessions: 15, maxSessions: 18, price: 6500, tier: "Course 16", perSession: 406 },
    { minSessions: 19, maxSessions: null, price: 7000, tier: "Course 19+", perSession: 350 },
];

// Adults Pricing Tiers (Placeholder - รอราคาจริง)
export const ADULTS_PRICING_TIERS: PricingTier[] = [
    { minSessions: 1, maxSessions: 1, price: 800, tier: "รายครั้ง", perSession: 800 },
    { minSessions: 2, maxSessions: 6, price: 3000, tier: "Course 4", perSession: 750 },
    { minSessions: 7, maxSessions: 10, price: 5000, tier: "Course 8", perSession: 625 },
    { minSessions: 11, maxSessions: 14, price: 6500, tier: "Course 12", perSession: 542 },
    { minSessions: 15, maxSessions: 18, price: 8000, tier: "Course 16", perSession: 500 },
    { minSessions: 19, maxSessions: null, price: 9000, tier: "Course 19+", perSession: 474 },
];

// Legacy: For backwards compatibility
export const PRICING_TIERS = KIDS_PRICING_TIERS;

export function calculatePrice(
    sessions: number,
    courseType: CourseType = 'kids'
): { price: number; tier: string; perSession: number } {
    const tiers = courseType === 'adults' ? ADULTS_PRICING_TIERS : KIDS_PRICING_TIERS;

    if (sessions <= 0) {
        return { price: 0, tier: "-", perSession: 0 };
    }

    for (const tier of tiers) {
        if (tier.maxSessions === null) {
            return { price: tier.price, tier: tier.tier, perSession: tier.perSession };
        }
        if (sessions >= tier.minSessions && sessions <= tier.maxSessions) {
            return { price: tier.price, tier: tier.tier, perSession: tier.perSession };
        }
    }

    // Fallback to last tier
    const lastTier = tiers[tiers.length - 1];
    return { price: lastTier.price, tier: lastTier.tier, perSession: lastTier.perSession };
}

export function formatPrice(amount: number): string {
    return new Intl.NumberFormat("th-TH").format(amount);
}

export function getPricingDescription(sessions: number, courseType: CourseType = 'kids'): string {
    const { tier, perSession } = calculatePrice(sessions, courseType);
    if (sessions === 0) return "เลือกวันเรียนเพื่อดูราคา";
    return `${tier} (เฉลี่ย ฿${formatPrice(perSession)}/ครั้ง)`;
}

// Get all tiers for a course type
export function getPricingTiers(courseType: CourseType = 'kids'): PricingTier[] {
    return courseType === 'adults' ? ADULTS_PRICING_TIERS : KIDS_PRICING_TIERS;
}

// Calculate family total (multiple enrollments)
export function calculateFamilyTotal(
    enrollments: { sessions: number; courseType: CourseType }[]
): { total: number; breakdown: { price: number; tier: string }[] } {
    const breakdown = enrollments.map(e => {
        const { price, tier } = calculatePrice(e.sessions, e.courseType);
        return { price, tier };
    });
    const total = breakdown.reduce((sum, b) => sum + b.price, 0);
    return { total, breakdown };
}

