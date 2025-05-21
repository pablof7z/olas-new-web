Keep an inventory of all code files with a one-liner of the role. Only include code files (src/ directory) in the inventory. Whenever you notice a discrepancy, or when you create/delete files, update this inventory. This is your map and should always be accurate.

Guidelines:

- Code always goes in src/
- Organize by features: src/features/{hooks,stores,components,utils} -- only create the directories when they are needed; i.e. don't preemptively create a "stores" component if the feature doesn't REALLY require one.
- Try to produce components as reusable as possible.

# File Inventory
- [`src/app/globals.css`](src/app/globals.css:0): Global CSS styles.
- [`src/app/layout.tsx`](src/app/layout.tsx:0): Root layout for the Next.js application, includes NDKHeadless setup.
- [`src/app/p/[npub]/layout.tsx`](src/app/p/[npub]/layout.tsx:0): Layout for the user profile page, includes Hero and Tabs.
- [`src/app/p/[npub]/page.tsx`](src/app/p/[npub]/page.tsx:0): Default page for user profile, displays "Posts" section.
- [`src/app/p/[npub]/updates/page.tsx`](src/app/p/[npub]/updates/page.tsx:0): Page for user profile "Updates" section.
- [`src/app/page.module.css`](src/app/page.module.css:0): CSS modules for the landing page.
- [`src/app/page.tsx`](src/app/page.tsx:0): Landing page, displays a Nostr event feed and sidebar.
- [`src/components/ui/avatar.tsx`](src/components/ui/avatar.tsx:0): Shadcn/ui Avatar component.
- [`src/components/ui/badge.tsx`](src/components/ui/badge.tsx:0): Shadcn/ui Badge component.
- [`src/components/ui/button.tsx`](src/components/ui/button.tsx:0): Shadcn/ui Button component.
- [`src/components/ui/card.tsx`](src/components/ui/card.tsx:0): Shadcn/ui Card component.
- [`src/components/ui/checkbox.tsx`](src/components/ui/checkbox.tsx:0): Shadcn/ui Checkbox component.
- [`src/components/ui/dialog.tsx`](src/components/ui/dialog.tsx:0): Shadcn/ui Dialog component.
- [`src/components/ui/dropdown-menu.tsx`](src/components/ui/dropdown-menu.tsx:0): Shadcn/ui Dropdown Menu component.
- [`src/components/ui/input.tsx`](src/components/ui/input.tsx:0): Shadcn/ui Input component.
- [`src/components/ui/tabs.tsx`](src/components/ui/tabs.tsx:0): Shadcn/ui Tabs component.
- [`src/features/navigation/components/SiteHeader.tsx`](src/features/navigation/components/SiteHeader.tsx:0): Site-wide navigation header component.
- [`src/features/nostr/components/CardHeader.tsx`](src/features/nostr/components/CardHeader.tsx:0): Component for displaying the header of a Nostr event card.
- [`src/features/nostr/components/ImageEventCard.tsx`](src/features/nostr/components/ImageEventCard.tsx:0): Component for displaying a Nostr image event in a card format.
- [`src/features/nostr/components/ImageEventGridItem.tsx`](src/features/nostr/components/ImageEventGridItem.tsx:0): Component to display a single Nostr image event in a grid.
- [`src/features/nostr/components/ImagePostModal.tsx`](src/features/nostr/components/ImagePostModal.tsx:0): Modal component for displaying a Nostr image post with details.
- [`src/features/nostr/components/UserAvatar.tsx`](src/features/nostr/components/UserAvatar.tsx:0): Component for displaying a user's avatar, typically from Nostr profile.
- [`src/features/profile/components/ImagePostGridItem.tsx`](src/features/profile/components/ImagePostGridItem.tsx:0): Component to display a single image in the profile posts grid.