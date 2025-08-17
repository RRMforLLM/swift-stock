# Swift Stock

Swift Stock is an inventory management application designed to track uniforms across multiple stores. The application helps manage the distribution and tracking of different types of uniforms, their sizes, and movement between stores.

## Features

- **Store Management**: Track multiple store locations
- **Uniform Inventory**: Keep record of uniforms with their types and sizes
- **Stock Operations**: Monitor uniform movements:
  - Track entries (incoming stock)
  - Track exits (outgoing stock)
  - Record quantities, dates, and store locations
- **Database Export/Import**: Export and reset database functionality

## Database Structure

### Stores
- Unique identifier and name for each store location
- Track store information for inventory management

### Uniforms
- Unique identifier for each uniform type
- Track uniform types and sizes

### Operations
- Record all stock movements (entries and exits)
- Track:
  - Type of operation (entry/exit)
  - Associated uniform
  - Store location
  - Quantity
  - Date and time of operation

## Tech Stack

- **React Native** with **Expo** for cross-platform mobile development
- **TypeScript** for type safety
- **SQLite** (expo-sqlite) for local database storage
- **Expo Router** for navigation
