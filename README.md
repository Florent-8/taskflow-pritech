# TaskFlow

TaskFlow is a React Native (Expo) app for managing personal tasks with local persistence, navigation, search, filters, and first-launch demo data.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Expo:

   ```bash
   npx expo start
   ```

   If Expo Go on a physical phone cannot connect or says the app is taking too long, start with a tunnel instead:

   ```bash
   npm run start:tunnel
   ```

3. Run the app:

   - iOS: press `i` in the Expo terminal, or scan the QR code with Expo Go on iOS.
   - Android: press `a` in the Expo terminal, or scan the QR code with Expo Go on Android.
   - Web: press `w` in the Expo terminal.

   Pressing `a` requires Android Studio, the Android SDK, and `adb` installed locally. If those are not installed, scan the QR code with Expo Go instead.

## What Was Implemented

- Task list: `TaskListScreen` renders tasks with `FlatList`, newest first.
- Task rows: `TaskListItem` shows title, created date, completion toggle, details navigation, and delete action.
- Add task: `AddTaskScreen` validates title and description inline before creating a task.
- Task details: `TaskDetailsScreen` shows the full task, formatted date, status, toggle action, and confirmation-protected delete.
- Local persistence: all task changes are saved through `services/taskStorage.ts` using AsyncStorage.
- First-launch seed data: `services/seedService.ts` fetches five JSONPlaceholder todos once, maps them into TaskFlow tasks, then records a seeded flag.
- Offline behavior: if the seed request fails, the app starts with an empty list and continues to work locally.
- Search: the list filters by title live as the user types.
- Status filter: `FilterBar` supports All, Completed, and Active views.
- Navigation: React Navigation native stack connects list, add, and details screens.
- Shared UI foundation: `theme.ts` centralizes color, spacing, radius, and typography constants.

## Architecture Decisions

- Context plus `useReducer` keeps task state predictable without adding Redux-level complexity to a small app.
- AsyncStorage is wrapped in `taskStorage.ts` so persistence stays typed and isolated from UI components.
- The JSONPlaceholder import is isolated in `seedService.ts` because it is demo bootstrapping, not part of the core task model.
- Reusable components keep screen files focused on orchestration instead of repeated JSX.

## Folder Structure

```text
src/
  components/   Reusable UI such as task rows, empty state, search, and filters
  context/      TaskContext with reducer-backed task state and actions
  navigation/   AppNavigator and root stack route types
  screens/      Task list, add task, and task details screens
  services/     AsyncStorage persistence and JSONPlaceholder seeding
  types/        Task model and filter types
  utils/        Date formatting, validation, and UUID helper
```

## Known Limitations / What I Would Improve With More Time

- No automated tests are included; I would add reducer, validation, and storage tests first.
- There is no edit-task screen yet; users can create, toggle, and delete tasks.
- The first-launch import is intentionally small and simple; a production app would add richer retry and sync behavior.

## Screenshots / Screen Recording

Drop screenshots or a short screen recording in a `docs/` folder and link them here:

- Task list:
- Add task:
- Task details:
