---
name: Hyperlocal Pulse
colors:
  surface: '#fbf8ff'
  surface-dim: '#d9d9e7'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2ff'
  surface-container: '#ededfb'
  surface-container-high: '#e7e7f5'
  surface-container-highest: '#e1e1ef'
  on-surface: '#191b25'
  on-surface-variant: '#434656'
  inverse-surface: '#2e303a'
  inverse-on-surface: '#f0effe'
  outline: '#737688'
  outline-variant: '#c3c5d9'
  surface-tint: '#004ced'
  primary: '#003ec7'
  on-primary: '#ffffff'
  primary-container: '#0052ff'
  on-primary-container: '#dfe3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#994700'
  on-secondary: '#ffffff'
  secondary-container: '#fb7800'
  on-secondary-container: '#592600'
  tertiary: '#952200'
  on-tertiary: '#ffffff'
  tertiary-container: '#bf3003'
  on-tertiary-container: '#ffddd5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001452'
  on-primary-fixed-variant: '#0038b6'
  secondary-fixed: '#ffdbc8'
  secondary-fixed-dim: '#ffb68b'
  on-secondary-fixed: '#321200'
  on-secondary-fixed-variant: '#753400'
  tertiary-fixed: '#ffdbd2'
  tertiary-fixed-dim: '#ffb4a1'
  on-tertiary-fixed: '#3c0800'
  on-tertiary-fixed-variant: '#891e00'
  background: '#fbf8ff'
  on-background: '#191b25'
  surface-variant: '#e1e1ef'
typography:
  h1:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The design system is anchored in the concept of "Digital Neighborhood Stewardship." It bridges the gap between sophisticated technology and the warmth of local community commerce. The brand personality is professional yet approachable—acting as a reliable guide that connects users to their immediate surroundings.

The visual style follows a **Corporate / Modern** aesthetic with a high-vibrancy accent strategy. It prioritizes clarity and efficiency to reduce cognitive load for users navigating complex maps and inventory lists, while utilizing energetic color hits to evoke a sense of local discovery and excitement.

## Colors

The palette is led by **Hyperlocal Blue**, a deep, saturated sapphire that communicates technological precision and security. This is contrasted by **Neighborhood Orange**, used exclusively for high-priority calls to action and "active" states to provide a friendly, energetic counterpoint.

Backgrounds utilize soft neutrals and off-whites to ensure the interface feels airy and "clean," preventing the information-dense dashboards from feeling cluttered. Success, warning, and error states should remain standard but adjusted to match the saturation levels of the primary blue.

## Typography

The design system utilizes **Inter** across all levels to maintain a systematic, utilitarian feel that ensures maximum readability at small sizes—essential for map labels and data-heavy tables. 

Headlines use a tighter letter-spacing and heavier weights to create a strong visual anchor. Body copy is optimized with a generous line height to improve the scanning experience of product descriptions and local news feeds. Labels use a slightly increased weight to remain legible against colorful backgrounds and badges.

## Layout & Spacing

This design system employs a **Fluid Grid** model based on a 12-column system for desktop and a 4-column system for mobile. A strict 4px baseline rhythm ensures vertical consistency across all components.

Layouts should prioritize "Safe Zones"—generous internal margins within cards and containers (24px) to prevent content from feeling cramped. For data dashboards, the spacing collapses to 16px (md) to allow for higher information density without sacrificing the clean aesthetic.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Tonal Layering**. Instead of harsh borders, surfaces are differentiated by subtle depth increments:

1.  **Level 0 (Base):** The primary background color (soft neutral).
2.  **Level 1 (Cards/Content):** White surfaces with a very soft, 10% opacity blue-tinted shadow (4px blur).
3.  **Level 2 (Navigation/Floating):** White surfaces with a more pronounced 15% opacity shadow (12px blur), used for sticky headers or floating action buttons.
4.  **Level 3 (Modals/Overlays):** Centered elements with high-diffusion shadows (24px blur) to pull focus.

Maps use a "Flat-on-Deep" approach where UI controls float over the map surface with Level 2 elevation to ensure they are never lost in the cartographic detail.

## Shapes

The design system uses a **Rounded** shape language to reinforce the "friendly neighborhood" feel. The standard radius is 8px (0.5rem), which provides a modern, approachable look while maintaining enough structure for professional data visualization. 

Buttons and input fields follow the standard 8px radius, while larger containers like product cards or map overlays may scale up to 16px (1rem) to soften the overall appearance of the page.

## Components

### Buttons
*   **Primary:** Solid Hyperlocal Blue with white text. High-contrast and trustworthy.
*   **Action (CTA):** Solid Neighborhood Orange. Used for 'Buy Now', 'Add to Cart', or 'Confirm Order'.
*   **Secondary:** Outlined Hyperlocal Blue with a 1px stroke.

### Cards
Product and store cards feature a Level 1 shadow and an 8px corner radius. Image containers within cards should have a subtle inner-glow or a very light gray border to define boundaries against white backgrounds.

### Maps & Markers
Map pins should use the Primary Blue for standard locations and the Secondary Orange for the user’s current selection or featured "Hotspots." Use a "Pill" shape for price tags on the map.

### Data Dashboards
Charts should utilize a palette derived from the Primary Blue (tints and shades) to keep the data feel cohesive. Use "Ghost" borders (1px solid light gray) to separate table rows rather than alternating row colors.

### Inputs & Chips
Input fields use a Level 0 background with a subtle 1px border that turns Primary Blue on focus. Chips for category filtering use a pill-shape (fully rounded) to distinguish them from rectangular action buttons.