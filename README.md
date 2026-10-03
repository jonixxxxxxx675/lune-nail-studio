# LUNE Nail Studio

Static HTML/CSS/Vanilla JS frontend.

## Structure
- `index.html` — complete page structure and booking modal
- `css/reset.css` — base reset and `[hidden]` fix
- `css/variables.css` — design tokens
- `css/style.css` — responsive Desktop/Mobile styles
- `js/main.js` — intro, header, menu, icons, modal, carousels
- `js/booking.js` — 6-step booking flow, calendar and 30-minute slots
- `assets/images/` — real project images
- `assets/video/` — video asset

## Booking
Current booking is demo/local only and uses `localStorage`. Replace storage logic with Supabase for production.

## Important
Desktop and Mobile use separate responsive rules. The mobile layout is not a scaled copy of Desktop.
