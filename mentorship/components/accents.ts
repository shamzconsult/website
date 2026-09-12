/* ============================================================================
 * ACCENTS
 * ============================================================================
 * Mentors are orange, mentees are teal, and anything either party touches
 * (the call log) is ink. Tailwind needs whole class names, so every accented
 * component picks its classes from this table rather than building strings.
 * ==========================================================================*/

export type Accent = "brand" | "teal" | "ink";

export interface AccentStyles {
  /** Solid fill for primary buttons and selected chips. */
  solid: string;
  /** Just the background colour, for small selected swatches. */
  fill: string;
  /** Text colour on light surfaces. */
  text: string;
  /** Tinted panel background. */
  tint: string;
  /** Border for a selected/active element. */
  border: string;
  /** Focus ring on inputs. */
  ring: string;
  /** Selected state for a pill or option button. */
  selected: string;
  /** Badge on a dark banner. */
  badge: string;
  /** Glow behind the dark banner. */
  glow: string;
  /** Step-number circle. */
  step: string;
}

export const ACCENT: Record<Accent, AccentStyles> = {
  brand: {
    solid: "bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600",
    fill: "bg-brand-500",
    text: "text-brand-600",
    tint: "bg-brand-50",
    border: "border-brand-500",
    ring: "focus:border-brand-400 focus:ring-4 focus:ring-brand-100",
    selected: "border-brand-500 bg-brand-50 ring-4 ring-brand-100",
    badge: "border-brand-400/30 bg-brand-500/10 text-brand-300",
    glow: "bg-brand-600/30",
    step: "bg-brand-100 text-brand-700",
  },
  teal: {
    solid: "bg-teal-600 text-white shadow-lg shadow-teal-600/25 hover:bg-teal-700",
    fill: "bg-teal-600",
    text: "text-teal-700",
    tint: "bg-teal-50",
    border: "border-teal-500",
    ring: "focus:border-teal-400 focus:ring-4 focus:ring-teal-100",
    selected: "border-teal-500 bg-teal-50 ring-4 ring-teal-100",
    badge: "border-teal-400/30 bg-teal-500/10 text-teal-300",
    glow: "bg-teal-500/25",
    step: "bg-teal-100 text-teal-700",
  },
  ink: {
    solid: "bg-ink-700 text-white shadow-lg shadow-ink-700/25 hover:bg-ink-800",
    fill: "bg-ink-700",
    text: "text-ink-700",
    tint: "bg-ink-50",
    border: "border-ink-500",
    ring: "focus:border-ink-400 focus:ring-4 focus:ring-ink-100",
    selected: "border-ink-500 bg-ink-50 ring-4 ring-ink-100",
    badge: "border-white/20 bg-white/10 text-ink-200",
    glow: "bg-ink-500/30",
    step: "bg-ink-100 text-ink-700",
  },
};
