Maintain an accurate inventory of all code files within the `src/` directory, providing a concise one-line summary clearly stating each file's responsibility and scope. Immediately update this inventory whenever you create, significantly modify, or delete files.

**Inventory Guidelines**

- **Clearly state the file's purpose:** Each entry should explicitly describe what the file does, its main responsibility, and scope.
- **Avoid vagueness:** Entries must precisely communicate responsibilities and usage context to enable quick understanding by other LLMs without additional context.

### Inventory

```
src/
├── app/favicon.ico  # Application favicon for browser tab icon
├── app/globals.css  # Global CSS variables, color schemes, and base styles for the app
├── app/layout.tsx  # Root layout component providing global structure, theme, sidebar, and NDK session context
├── app/page.module.css  # Scoped CSS styles for the main page layout, grid, and responsive design
├── app/page.tsx  # Home page displaying a quilted grid of Nostr images and trending hashtags sidebar
├── app/p/[npub]/layout.tsx  # Layout and context provider for user profile pages, resolving npub/NIP-05 and rendering profile header/tabs
├── app/p/[npub]/page.tsx  # User profile posts page showing a grid of image and text events for the user
├── app/p/[npub]/updates/page.tsx  # Placeholder component for the updates section of a user's profile
├── components/ui/avatar.tsx  # Avatar component set for displaying user images or initials
├── components/ui/badge.tsx  # Badge component for inline status or category labels with variant styling
├── components/ui/button.tsx  # Button component with multiple variants and sizes for consistent UI
├── components/ui/card.tsx  # Card component set for displaying content in styled, sectioned cards
├── components/ui/checkbox.tsx  # Styled Checkbox component using Radix UI primitives
├── components/ui/dialog.tsx  # Dialog/modal component set with overlay, content, and close functionality
├── components/ui/dropdown-menu.tsx  # DropdownMenu component set for accessible, styled dropdowns with groups, items, and submenus
├── components/ui/input.tsx  # Styled Input component for consistent text input fields
├── components/ui/RelativeTimeDisplay.tsx  # RelativeTimeDisplay component for showing auto-updating human-readable relative time (e.g., "3 days ago", "in 2 hours") for a given date
├── components/ui/tabs.tsx  # Tabs component set for accessible, styled tabbed interfaces
├── features/navigation/components/Sidebar.tsx  # Main vertical sidebar for navigation, theme toggling, and avatar access
├── features/navigation/components/ThemeProvider.tsx  # React context/provider for managing and toggling light/dark theme
├── features/nostr/components/CardHeader.tsx  # EventCardHeader component displaying event author info, timestamp, and actions
├── features/nostr/components/ImageEventCard.tsx  # ImageEventCard component rendering a Nostr image event in a card with modal preview
├── features/nostr/components/ImageEventGridItem.tsx  # ImageEventGridItem component rendering a single image for use in image grids
├── features/nostr/components/ImagePostModal.module.css  # CSS styles for the image post modal, including layout and responsive design
├── features/nostr/components/ImagePostModal.tsx  # ImagePostModal component rendering a modal with image, author info, and comments
├── features/nostr/components/UserAvatar.tsx  # UserAvatar component rendering a user's avatar image or initials from Nostr profile
├── features/profile/components/ImagePostGridItem.tsx  # ImagePostGridItem for clickable images in profile grid, opening modal with event details
├── features/profile/components/ProfileHero.tsx  # ProfileHero component displaying user's banner, avatar, name, NIP-05, and about section
├── features/profile/components/ProfileTabs.tsx  # ProfileTabs component rendering tab navigation for posts and updates
├── features/sidebar/components/Sidebar.tsx  # Sidebar component for desktop, displaying trending hashtags and users
├── features/sidebar/components/TrendingHashtags.tsx  # TrendingHashtags component displaying a list of trending hashtags as links
├── features/sidebar/components/TrendingUsers.tsx  # TrendingUsers component displaying a list of most active users based on Nostr events
├── features/post-editor/components/PostEditor.tsx  # PostEditor component for creating new posts, featuring user avatar/name, drag-and-drop/click-to-upload image functionality with main preview and carousel for multiple images, a borderless caption input, and post scheduling with date/time selection and relative time display.
├── lib/utils.ts  # Utility function for merging Tailwind and clsx class names
```
