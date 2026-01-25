// =====================================================
// Pricing Utility Functions - CMS NASC
// Supports: Kids Group, Adult Group, Private, Sibling Pricing
// Date: 2026-01-25
// =====================================================

import type { CourseTypeCode, PricingTier } from '@/types/database';

// =====================================================
// TYPES
// =====================================================

export interface PriceTier {
    minSessions: number;
    maxSessions: number | null;
    totalPrice: number;
    pricePerSession: number;
    validityMonths: number;
    name: string;
}

export interface PriceCalculation {
    totalPrice: number;
    pricePerSession: number;
    tierName: string;
    validityMonths: number;
}

export interface StudentBooking {
    studentId: string;
    sessions: number;
    courseType: CourseTypeCode;
}

export interface SiblingPriceResult {
    total: number;
    breakdown: {
        studentId: string;
        sessions: number;
        price: number;
        tierName: string;
    }[];
    siblingDiscountApplied: boolean;
    combinedSessions: number;
}

// =====================================================
// PRICING DATA
// =====================================================

// Kids Group Pricing (รายเดือน)
export const KIDS_GROUP_PRICING: PriceTier[] = [
    { minSessions: 1, maxSessions: 1, totalPrice: 700, pricePerSession: 700, validityMonths: 1, name: 'รายครั้ง' },
    { minSessions: 2, maxSessions: 6, totalPrice: 2500, pricePerSession: 625, validityMonths: 1, name: 'Course 4' },
    { minSessions: 7, maxSessions: 10, totalPrice: 4000, pricePerSession: 500, validityMonths: 1, name: 'Course 8' },
    { minSessions: 11, maxSessions: 14, totalPrice: 5200, pricePerSession: 433, validityMonths: 1, name: 'Course 12' },
    { minSessions: 15, maxSessions: 18, totalPrice: 6500, pricePerSession: 406, validityMonths: 1, name: 'Course 16' },
    { minSessions: 19, maxSessions: null, totalPrice: 7000, pricePerSession: 350, validityMonths: 1, name: 'Course 19+' },
];

// Adult Group Pricing (ใช้ได้ 10 เดือน สำหรับ 10-16 ครั้ง)
export const ADULT_GROUP_PRICING: PriceTier[] = [
    { minSessions: 1, maxSessions: 1, totalPrice: 600, pricePerSession: 600, validityMonths: 1, name: 'รายครั้ง' },
    { minSessions: 2, maxSessions: 9, totalPrice: 5500, pricePerSession: 550, validityMonths: 10, name: 'Course 10' },
    { minSessions: 10, maxSessions: 10, totalPrice: 5500, pricePerSession: 550, validityMonths: 10, name: 'Course 10' },
    { minSessions: 11, maxSessions: 16, totalPrice: 8000, pricePerSession: 500, validityMonths: 10, name: 'Course 16' },
    { minSessions: 17, maxSessions: null, totalPrice: 8000, pricePerSession: 500, validityMonths: 10, name: 'Course 16' },
];

// Private Pricing
export const PRIVATE_PRICING: PriceTier[] = [
    { minSessions: 1, maxSessions: 9, totalPrice: 900, pricePerSession: 900, validityMonths: 1, name: 'รายชั่วโมง' },
    { minSessions: 10, maxSessions: null, totalPrice: 8000, pricePerSession: 800, validityMonths: 6, name: 'Package 10 ชม.' },
];

// =====================================================
// PRICING FUNCTIONS
// =====================================================

/**
 * Get pricing tiers for a course type
 */
export function getPricingTiers(courseType: CourseTypeCode): PriceTier[] {
    switch (courseType) {
        case 'kids_group':
            return KIDS_GROUP_PRICING;
        case 'adult_group':
            return ADULT_GROUP_PRICING;
        case 'private':
            return PRIVATE_PRICING;
        default:
            return KIDS_GROUP_PRICING;
    }
}

/**
 * Calculate price for a given number of sessions and course type
 */
export function calculatePrice(
    sessions: number,
    courseType: CourseTypeCode = 'kids_group'
): PriceCalculation {
    if (sessions <= 0) {
        return { totalPrice: 0, pricePerSession: 0, tierName: '-', validityMonths: 1 };
    }

    const tiers = getPricingTiers(courseType);

    for (const tier of tiers) {
        if (tier.maxSessions === null && sessions >= tier.minSessions) {
            return {
                totalPrice: tier.totalPrice,
                pricePerSession: tier.pricePerSession,
                tierName: tier.name,
                validityMonths: tier.validityMonths,
            };
        }
        if (sessions >= tier.minSessions && sessions <= (tier.maxSessions ?? 999)) {
            return {
                totalPrice: tier.totalPrice,
                pricePerSession: tier.pricePerSession,
                tierName: tier.name,
                validityMonths: tier.validityMonths,
            };
        }
    }

    // Fallback to last tier
    const lastTier = tiers[tiers.length - 1];
    return {
        totalPrice: lastTier.totalPrice,
        pricePerSession: lastTier.pricePerSession,
        tierName: lastTier.name,
        validityMonths: lastTier.validityMonths,
    };
}

/**
 * Calculate sibling pricing (เรทพี่น้อง)
 * รวมจำนวนครั้งของลูกทุกคนเพื่อได้เรทที่ดีกว่า
 */
export function calculateSiblingPrice(
    bookings: StudentBooking[]
): SiblingPriceResult {
    // Group by course type (only kids_group applies sibling pricing)
    const kidsBookings = bookings.filter(b => b.courseType === 'kids_group');
    const otherBookings = bookings.filter(b => b.courseType !== 'kids_group');

    // Calculate combined sessions for kids
    const combinedSessions = kidsBookings.reduce((sum, b) => sum + b.sessions, 0);

    // Get price tier for combined sessions
    const combinedTier = calculatePrice(combinedSessions, 'kids_group');

    // Calculate individual prices without sibling discount for comparison
    const individualTotal = kidsBookings.reduce((sum, b) => {
        const { totalPrice } = calculatePrice(b.sessions, 'kids_group');
        return sum + totalPrice;
    }, 0);

    // Calculate with sibling discount
    const siblingTotal = combinedSessions > 0
        ? combinedTier.pricePerSession * combinedSessions
        : 0;

    // Use the better price (sibling discount if it saves money)
    const useSiblingDiscount = siblingTotal < individualTotal && kidsBookings.length > 1;

    // Build breakdown
    const breakdown: SiblingPriceResult['breakdown'] = [];

    // Kids bookings
    for (const booking of kidsBookings) {
        if (useSiblingDiscount) {
            breakdown.push({
                studentId: booking.studentId,
                sessions: booking.sessions,
                price: combinedTier.pricePerSession * booking.sessions,
                tierName: `${combinedTier.tierName} (เรทพี่น้อง)`,
            });
        } else {
            const { totalPrice, tierName } = calculatePrice(booking.sessions, 'kids_group');
            breakdown.push({
                studentId: booking.studentId,
                sessions: booking.sessions,
                price: totalPrice,
                tierName,
            });
        }
    }

    // Other bookings (adult, private)
    for (const booking of otherBookings) {
        const { totalPrice, tierName } = calculatePrice(booking.sessions, booking.courseType);
        breakdown.push({
            studentId: booking.studentId,
            sessions: booking.sessions,
            price: totalPrice,
            tierName,
        });
    }

    const total = breakdown.reduce((sum, b) => sum + b.price, 0);

    return {
        total,
        breakdown,
        siblingDiscountApplied: useSiblingDiscount,
        combinedSessions,
    };
}

/**
 * Calculate additional sessions cost
 * เมื่อเรียนเกินจำนวนครั้งที่ซื้อไว้
 */
export function calculateAdditionalSessionsCost(
    purchasedSessions: number,
    additionalSessions: number,
    courseType: CourseTypeCode = 'kids_group'
): { cost: number; pricePerSession: number } {
    // Use the price tier of purchased sessions for additional
    const tier = calculatePrice(purchasedSessions, courseType);
    const cost = tier.pricePerSession * additionalSessions;

    return {
        cost,
        pricePerSession: tier.pricePerSession,
    };
}

/**
 * Format price in Thai Baht
 */
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('th-TH').format(amount);
}

/**
 * Format price with currency symbol
 */
export function formatPriceWithSymbol(amount: number): string {
    return `฿${formatPrice(amount)}`;
}

/**
 * Get pricing description for display
 */
export function getPricingDescription(
    sessions: number,
    courseType: CourseTypeCode = 'kids_group'
): string {
    if (sessions === 0) return 'เลือกวันเรียนเพื่อดูราคา';

    const { tierName, pricePerSession, validityMonths } = calculatePrice(sessions, courseType);

    let desc = `${tierName} (เฉลี่ย ฿${formatPrice(pricePerSession)}/ครั้ง)`;

    if (validityMonths > 1) {
        desc += ` • ใช้ได้ ${validityMonths} เดือน`;
    }

    return desc;
}

/**
 * Get session tier status with emoji
 */
export function getSessionTierStatus(sessionsPerMonth: number): {
    description: string;
    emoji: string;
    color: string;
    warning: boolean;
} {
    if (sessionsPerMonth < 4) {
        return {
            description: 'ควรหาวันเรียนเพิ่ม เพื่อความต่อเนื่องของทักษะแบดมินตัน',
            emoji: '⚠️',
            color: '#EF4444',
            warning: true,
        };
    } else if (sessionsPerMonth === 4) {
        return { description: 'ขั้นต่ำ', emoji: '🏸', color: '#10B981', warning: false };
    } else if (sessionsPerMonth <= 8) {
        return { description: 'ออกกำลังกาย', emoji: '💪', color: '#3B82F6', warning: false };
    } else if (sessionsPerMonth <= 12) {
        return { description: 'เริ่มต้นเป็นนักกีฬา', emoji: '⭐', color: '#8B5CF6', warning: false };
    } else if (sessionsPerMonth <= 16) {
        return { description: 'นักกีฬา', emoji: '🏆', color: '#F59E0B', warning: false };
    } else if (sessionsPerMonth <= 19) {
        return { description: 'นักกีฬา', emoji: '🏆', color: '#F59E0B', warning: false };
    } else if (sessionsPerMonth >= 24) {
        return { description: 'นักกีฬาระดับประเทศ', emoji: '🥇', color: '#DC2626', warning: false };
    }
    return { description: 'นักกีฬา', emoji: '🏆', color: '#F59E0B', warning: false };
}

/**
 * Calculate validity end date
 */
export function calculateValidityEndDate(
    purchaseDate: Date,
    validityMonths: number
): Date {
    const endDate = new Date(purchaseDate);
    endDate.setMonth(endDate.getMonth() + validityMonths);
    return endDate;
}

/**
 * Check if enrollment is still valid
 */
export function isEnrollmentValid(validUntil: string): boolean {
    return new Date(validUntil) >= new Date();
}

// =====================================================
// COUPON FUNCTIONS
// =====================================================

export interface CouponApplication {
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    couponCode: string;
}

/**
 * Apply coupon to price
 */
export function applyCoupon(
    originalPrice: number,
    discountType: 'percentage' | 'fixed',
    discountValue: number,
    maxDiscount?: number | null,
    minPurchase?: number
): { discountAmount: number; finalPrice: number } {
    // Check minimum purchase
    if (minPurchase && originalPrice < minPurchase) {
        return { discountAmount: 0, finalPrice: originalPrice };
    }

    let discountAmount = 0;

    if (discountType === 'percentage') {
        discountAmount = originalPrice * (discountValue / 100);
        // Apply max discount cap
        if (maxDiscount && discountAmount > maxDiscount) {
            discountAmount = maxDiscount;
        }
    } else {
        discountAmount = discountValue;
    }

    // Ensure discount doesn't exceed price
    if (discountAmount > originalPrice) {
        discountAmount = originalPrice;
    }

    return {
        discountAmount,
        finalPrice: originalPrice - discountAmount,
    };
}

// Legacy exports for backwards compatibility
export type CourseType = CourseTypeCode;
export const PRICING_TIERS = KIDS_GROUP_PRICING;
export const KIDS_PRICING_TIERS = KIDS_GROUP_PRICING;
export const ADULTS_PRICING_TIERS = ADULT_GROUP_PRICING;
