# YouEnvy.me Project TODO

## Database & Schema
- [x] Create `settings` table for storing theme, colors, fonts, and visibility toggles
- [x] Create `content` table for storing home page sections (hero, features, etc.)
- [x] Create `owner` table for storing owner credentials (username, password hash)
- [x] Create database migrations and apply via SQL

## Authentication (No OAuth)
- [x] Implement custom username/password login endpoint
- [x] Hash passwords using PBKDF2 (crypto module)
- [x] Create session management with JWT tokens
- [x] Implement logout functionality
- [x] Add protected procedures for admin-only routes
- [x] Create login page UI

## Admin Dashboard Backend
- [x] Create tRPC procedure to fetch current settings
- [x] Create tRPC procedure to update content (headline, subheadline, description, CTA)
- [x] Create tRPC procedure to update theme settings (colors, fonts, backgrounds)
- [x] Create tRPC procedure to toggle section visibility
- [x] Create tRPC procedure to save all settings to database

## Admin Dashboard Frontend
- [x] Build admin layout with sidebar navigation
- [x] Create content editor panel (text inputs for headline, subheadline, description, CTA)
- [x] Create theme customizer panel (color picker, font selector, background style selector)
- [x] Create section visibility toggles
- [x] Implement real-time preview of changes
- [x] Add save/reset functionality
- [x] Create responsive admin UI

## Public Home Page
- [x] Build hero section with customizable headline, subheadline, description
- [x] Add CTA button with customizable text and link
- [x] Create navigation bar
- [x] Implement section visibility based on admin settings
- [x] Apply theme and design settings in real-time
- [x] Make home page responsive and visually appealing

## Design & Theming
- [x] Define default color palette
- [x] Create font options (sans-serif, serif, monospace)
- [x] Create background style options (solid, gradient, pattern)
- [x] Implement CSS variables for dynamic theming
- [x] Ensure all theme changes apply instantly without page reload

## Testing & Deployment
- [ ] Write vitest tests for authentication
- [ ] Write vitest tests for settings CRUD operations
- [x] Test login/logout flow
- [x] Test theme persistence across page reloads
- [x] Test section visibility toggles
- [ ] Verify responsive design on mobile/tablet/desktop
- [ ] Create checkpoint before delivery
