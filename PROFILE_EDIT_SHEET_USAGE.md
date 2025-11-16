# ProfileEditSheet Component Usage Guide

## Overview
`ProfileEditSheet` is a side-sliding panel component for editing user profile information. It uses Framer Motion for smooth animations and includes form validation, avatar upload, and loading states.

## Features

✨ **Smooth Animations**
- Slide-in animation from the right side
- Backdrop blur effect
- Spring-based transition with damping

📋 **Form Fields**
- Avatar upload with preview
- Name input
- Email input
- Location input
- Bio textarea (5 rows)

🎨 **UI/UX**
- Dark mode support
- Loading state with spinner
- Disabled inputs during submission
- Cancel and Save buttons
- Sticky header with close button

## Installation

The component is already exported in `components/profile/index.ts`:

```typescript
export { ProfileEditSheet } from "./ProfileEditSheet";
```

## Basic Usage

```tsx
import { useState } from 'react';
import { ProfileEditSheet } from '@/components/profile';
import { ProfileData } from '@/lib/types';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Food enthusiast',
    location: 'New York',
    avatarUrl: '',
  });

  const handleSave = async (updatedData: Partial<ProfileData>) => {
    // Call your API to save the data
    const response = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    
    if (response.ok) {
      setProfile({ ...profile, ...updatedData });
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Edit Profile
      </button>

      <ProfileEditSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        profile={profile}
        onSave={handleSave}
      />
    </>
  );
}
```

## Integration with ProfileHeader

The `ProfileHeader` component now includes built-in edit functionality:

```tsx
import { ProfileHeader } from '@/components/profile';
import { ProfileData } from '@/lib/types';

const profile: ProfileData = {
  name: 'Dima Fomin',
  email: 'dima@academy.com',
  bio: 'Chef & Instructor',
  location: 'Gdańsk, Poland',
  avatarUrl: 'https://...',
};

export function MyProfile() {
  const handleProfileUpdate = async (updatedProfile: Partial<ProfileData>) => {
    // Call your API
    await fetch('/api/profile/update', {
      method: 'POST',
      body: JSON.stringify(updatedProfile),
    });
  };

  return (
    <ProfileHeader
      name={profile.name || ''}
      email={profile.email || ''}
      avatar={profile.avatarUrl}
      bio={profile.bio}
      location={profile.location}
      followers={1200}
      following={350}
      profile={profile}
      onProfileUpdate={handleProfileUpdate}
    />
  );
}
```

## Props

### ProfileEditSheetProps

```typescript
interface ProfileEditSheetProps {
  // Control visibility
  isOpen: boolean;
  
  // Callback when user clicks close or outside
  onClose: () => void;
  
  // Current profile data to populate the form
  profile: ProfileData;
  
  // Callback when user clicks Save
  // Should return a Promise that resolves when done
  onSave: (updatedProfile: Partial<ProfileData>) => Promise<void>;
}
```

## ProfileData Fields

```typescript
interface ProfileData {
  userId?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  role?: "student" | "instructor" | "admin";
  level?: number;
  xp?: number;
  chefTokens?: number;
  bio?: string;
  language?: string;
  location?: string;
  phone?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
}
```

The form currently edits: `name`, `email`, `bio`, `location`, `avatarUrl`

To add more fields, modify the form in `ProfileEditSheet.tsx`:

```tsx
const [formData, setFormData] = useState({
  name: profile.name || "",
  email: profile.email || "",
  bio: profile.bio || "",
  location: profile.location || "",
  avatarUrl: profile.avatarUrl || "",
  // Add more fields here
  phone: profile.phone || "",
  instagram: profile.instagram || "",
});
```

## Styling & Customization

The component uses:
- **Design Tokens**: `colors.primary.light`, `composite.card`, `borderRadius.lg`
- **Tailwind CSS**: Responsive classes, dark mode support
- **Framer Motion**: Animation library for smooth transitions

### Dark Mode Colors

- Background: `white dark:bg-neutral-950`
- Text: `text-gray-900 dark:text-white`
- Borders: `border-gray-200 dark:border-gray-800`
- Input: `bg-white dark:bg-gray-900`
- Buttons: `hover:bg-gray-100 dark:hover:bg-gray-900`

## Keyboard & Accessibility

- ESC key closes the sheet (handled by backdrop click)
- Form fields are properly labeled with `<label>` elements
- Disabled state during loading prevents form submission
- Loading spinner provides visual feedback

## Error Handling

Errors are caught and logged but not displayed to user. To add error handling:

```tsx
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);
  
  try {
    await onSave(formData);
    onClose();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setIsLoading(false);
  }
};

// Add error display above the form
{error && (
  <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
    <p className="text-red-800 text-sm">{error}</p>
  </div>
)}
```

## Avatar Upload

The component uses FileReader API to convert image files to Base64:

```tsx
const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Optionally add file size/type validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  }
};
```

## Responsive Behavior

The sheet is **full-width on mobile** but **fixed to max-w-md (448px) on larger screens**:

```tsx
className="w-full max-w-md"
```

On mobile devices, the sheet takes up the full viewport width minus the space for the backdrop.

## Performance

- Uses React state for form data (no external state management required)
- Lazy renders the form only when `isOpen` is true
- No automatic API calls - you control when/how to save
- Image preview uses FileReader (no server uploads until save)

## Translation Support

The component uses hardcoded Polish text. To add translation support:

```tsx
const { t } = useLanguage();

// Replace hardcoded strings with translation keys
<h2 className="text-xl font-bold text-gray-900 dark:text-white">
  {t.profile.editSheet.title || "Edytuj profil"}
</h2>
```

Add to `lib/translations.ts`:

```typescript
editSheet: {
  title: 'Edytuj profil',
  close: 'Zamknij',
  profilePhoto: 'Zdjęcie profilowe',
  uploadPhoto: 'Wczytaj foto',
  name: 'Nazwa',
  email: 'Email',
  location: 'Lokalizacja',
  bio: 'Biografia',
  cancel: 'Anuluj',
  save: 'Zapisz zmiany',
  saving: 'Zapisywanie...',
}
```

## Common Issues & Solutions

### Issue: File upload not working
**Solution**: Ensure the file input has `type="file"` and `accept` attribute:
```tsx
<input
  type="file"
  accept="image/*"
  onChange={handleAvatarChange}
  className="hidden"
/>
```

### Issue: Form not submitting
**Solution**: Ensure the button is `type="submit"` inside a `<form>` with `onSubmit`:
```tsx
<form onSubmit={handleSubmit}>
  {/* form fields */}
  <button type="submit">Save</button>
</form>
```

### Issue: Changes not reflecting
**Solution**: Ensure the parent component updates state after `onSave` resolves:
```tsx
const handleSave = async (updatedProfile: Partial<ProfileData>) => {
  await api.updateProfile(updatedProfile);
  setProfile({ ...profile, ...updatedProfile }); // Update parent state
};
```

## Future Enhancements

Potential improvements:
- [ ] Multi-language support via useLanguage hook
- [ ] Form validation with error messages
- [ ] File size/type validation for avatar
- [ ] Undo changes button
- [ ] Draft auto-save
- [ ] Additional fields (phone, instagram, etc.)
- [ ] Photo crop/resize tool
- [ ] Social links validation
