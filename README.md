
# HOLOVOX Website

HOLOVOX is a Next.js app that combines a public landing experience, authenticated dashboards, real-time meeting rooms, podcast rooms, chat, notes, recordings, and a small admin area. The app uses the App Router, MongoDB via Mongoose, LiveKit for real-time media, Cloudinary for uploads, and React Toastify for notifications.

## What the app includes

- Public marketing landing page and authentication entry point.
- Home dashboard with meeting creation, scheduling, marketplace flow, and quick links.
- Meeting room experience with LiveKit audio/video, screen sharing, chat, reactions, whiteboard, recording, and participant controls.
- Podcast room experience with a similar LiveKit-based UI tailored for podcast sessions.
- User-facing pages for meetings, chat, notes, recordings, summaries, contact, and unauthorized access.
- API routes for authentication, LiveKit token generation, meetings, messages, notes, requests, info profiles, and recordings.
- MongoDB models for users, meetings, meeting chat, request chat, notes, recordings, requests, and profile/info documents.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- Tailwind CSS 4
- Mongoose + MongoDB
- LiveKit client and server SDK
- Cloudinary
- Framer Motion
- Lucide React icons
- React Toastify
- Nodemailer

## Project Structure

### App shell

- [src/app/layout.js](src/app/layout.js): root layout and global stylesheet entry.
- [src/app/page.js](src/app/page.js): public landing page and auth modal flow.
- [src/app/home/layout.jsx](src/app/home/layout.jsx): authenticated home shell with header and sidebar.
- [src/app/admindashboard/layout.jsx](src/app/admindashboard/layout.jsx): admin dashboard shell.

### Main user areas

- [src/app/home/page.jsx](src/app/home/page.jsx): main dashboard with meeting creation, scheduling, and marketplace flows.
- [src/app/home/meetings/page.jsx](src/app/home/meetings/page.jsx): meetings management view.
- [src/app/home/notes/page.jsx](src/app/home/notes/page.jsx): notes view.
- [src/app/home/recording/page.jsx](src/app/home/recording/page.jsx): recordings management view.
- [src/app/home/summaries/page.jsx](src/app/home/summaries/page.jsx): summaries view.
- [src/app/home/chat/page.jsx](src/app/home/chat/page.jsx): chat wrapper that reuses the shared chat UI.
- [src/app/home/contactus/page.jsx](src/app/home/contactus/page.jsx): contact page.
- [src/app/Unauthorized/page.js](src/app/Unauthorized/page.js): access denied page.

### Live meeting and podcast flow

- [src/app/meeting/[id]/page.js](src/app/meeting/[id]/page.js): LiveKit meeting entry page.
- [src/app/podcast/[id]/page.js](src/app/podcast/[id]/page.js): LiveKit podcast entry page.
- [src/components/meeting-room/MeetingUI.js](src/components/meeting-room/MeetingUI.js): main meeting-room controller UI.
- [src/components/podcast/PodcastMeetingUI.jsx](src/components/podcast/PodcastMeetingUI.jsx): podcast-room controller UI.
- [src/hooks/useMeetingState.js](src/hooks/useMeetingState.js): meeting state orchestration and track derivation.
- [src/hooks/useChat.js](src/hooks/useChat.js): LiveKit data channel chat plus persisted chat history.
- [src/hooks/usePermissions.js](src/hooks/usePermissions.js): meeting permission handling.
- [src/hooks/useRecording.js](src/hooks/useRecording.js): recording logic.
- [src/hooks/useWhiteboard.js](src/hooks/useWhiteboard.js): whiteboard state and controls.

### Shared UI

- [src/components/Navbar.jsx](src/components/Navbar.jsx): public navbar.
- [src/components/Hero.jsx](src/components/Hero.jsx): landing hero section.
- [src/components/Features.jsx](src/components/Features.jsx): feature marketing section.
- [src/components/Footer.jsx](src/components/Footer.jsx): footer.
- [src/components/login.jsx](src/components/login.jsx): login UI.
- [src/components/signup.jsx](src/components/signup.jsx): signup UI.
- [src/components/otpmodal.jsx](src/components/otpmodal.jsx): OTP modal.
- [src/components/ui/button.jsx](src/components/ui/button.jsx): shared button primitive.
- [src/components/ui/input.jsx](src/components/ui/input.jsx): shared input primitive.

### API routes

- [src/app/api/auth/login/route.js](src/app/api/auth/login/route.js): email/password login.
- [src/app/api/auth/Signup/route.js](src/app/api/auth/Signup/route.js): account creation with optional profile image upload.
- [src/app/api/auth/emailVerification/route.js](src/app/api/auth/emailVerification/route.js): OTP generation and verification.
- [src/app/api/token/route.js](src/app/api/token/route.js): LiveKit access token generation.
- [src/app/api/user/meeting/route.js](src/app/api/user/meeting/route.js): create, fetch, and update meetings.
- [src/app/api/user/messages/route.js](src/app/api/user/messages/route.js): meeting chat persistence.
- [src/app/api/user/notes/route.js](src/app/api/user/notes/route.js): notes CRUD.
- [src/app/api/user/upload-recording/route.js](src/app/api/user/upload-recording/route.js): recording persistence and deletion.
- [src/app/api/user/request/route.js](src/app/api/user/request/route.js): connection request handling.
- [src/app/api/user/request/messages/route.js](src/app/api/user/request/messages/route.js): private request chat messages.
- [src/app/api/user/info/route.js](src/app/api/user/info/route.js): profile/info creation and lookup.
- [src/app/api/user/dashboard/route.js](src/app/api/user/dashboard/route.js): dashboard meeting fetch.

### Database models

- [src/app/models/User.model.js](src/app/models/User.model.js): application user model.
- [src/app/models/Meeting.model.js](src/app/models/Meeting.model.js): meeting model and participant schema.
- [src/app/models/meetingMessages.model.js](src/app/models/meetingMessages.model.js): meeting chat messages.
- [src/app/models/Request.js](src/app/models/Request.js): connection request model.
- [src/app/models/RequestMessages.model.js](src/app/models/RequestMessages.model.js): request/private chat messages.
- [src/app/models/notes.model.js](src/app/models/notes.model.js): notes model.
- [src/app/models/Recording.model.js](src/app/models/Recording.model.js): recordings model.
- [src/app/models/info.model.js](src/app/models/info.model.js): detailed profile/info model.

## How the app works

1. The landing page routes users into login/signup flows.
2. Successful auth stores a JWT in `localStorage`.
3. Authenticated pages read the token with `getTokenData()` from [src/app/content/data.js](src/app/content/data.js).
4. Meeting and podcast pages request a LiveKit token from [src/app/api/token/route.js](src/app/api/token/route.js).
5. LiveKit rooms power audio/video, screen sharing, data channel chat, and participant state.
6. Meeting chat, notes, recordings, and meeting metadata are persisted in MongoDB.
7. Dashboard pages display and manage the persisted data.

## Environment Variables

The app currently reads some values from environment variables and also contains a few hardcoded credentials that should be moved out of source control.

Expected variables include:

- `MONGODB_URI`
- `JWT_SECRET`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `LIVEKIT_URL`
- `NEXT_PUBLIC_LIVEKIT_URL`

## Local Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Notes on Current State

- The codebase is functional but mixed between polished screens and partially completed pages.
- Some routes and utilities still need cleanup or validation before production use.
- There are hardcoded secrets in the repository that should be replaced with environment variables.
- Several pages are UI-heavy and rely on client-side state and browser APIs, so they should be treated as client components.

## Suggested Next Improvements

- Move all secrets and service credentials to environment variables.
- Clean up route-level import and model mismatches.
- Add consistent error handling across API routes.
- Replace placeholder or static dashboard content with real data sources where needed.
- Add a dedicated `.env.example` file once the variables are finalized.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
