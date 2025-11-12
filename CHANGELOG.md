# Changelog

## [Unreleased]

### Fixed
- Fixed critical bug where end dates were not being stored correctly in sync entities
  - Issue where going back a day would store today in the end date instead of yesterday
  - Issue where going forward would store incorrect dates
  - Single day view now always produces the same start and end date
  - Week view now produces correct date ranges

### Added
- Added `prevent_future_dates` configuration option to cap end dates at today
  - When enabled, week view caps at today when in current week
  - When enabled, month view caps at today when in current month
  - When enabled, year view caps at today when in current year
  - Next arrow button is automatically disabled when at current period with this option enabled
  - Useful for energy monitoring where future data doesn't exist
- Added UI editor support for the new `prevent_future_dates` setting
- Added comprehensive test suite for date calculation logic (20 new tests)

## [0.2.5] - 2024-12-19

### Changed
- Moved compare button to same row as period buttons for better layout
- Made today and compare icons smaller in compact mode (matching arrow button size)
- Improved compare button positioning: text version now appears above button group, icon version stays inline
- Updated sync direction labels from "Both Ways" to "Bi-directional" for better technical accuracy

### Fixed
- Fixed vertical alignment issues between compare button and period button group
- Resolved line-height issues causing misalignment in compact mode

## [0.2.4] - Previous release

### Fixed
- Fixes the date period button group not showing

### Changed
- Updates dependencies and TypeScript quality

### Added
- Adds header integration and layout modes for Energy Period Selector Plus
- Introduces compact and standard layout modes for better customization
- Adds sync_entity, sync_direction, and improves documentation