# Developer Quick Start - i18n

## Quick Reference

### Import Translations
```tsx
// Client Component
import { useTranslations } from 'next-intl';
const t = useTranslations();

// Server Component
import { getTranslations } from 'next-intl/server';
const t = await getTranslations();
```

### Import Navigation
```tsx
import { Link, useRouter, usePathname } from '@/i18n/routing';
```

### Import Formatting
```tsx
import { useFormatting } from '@/hooks/use-formatting';
const { formatCurrency, formatDate, formatNumber } = useFormatting();
```

## Common Patterns

### Button with Translation
```tsx
<Button>{t('common.buttons.save')}</Button>
```

### Form Label
```tsx
<Label>{t('students.form.name')}</Label>
```

### Page Title
```tsx
<h1>{t('dashboard.title')}</h1>
```

### Navigation Link
```tsx
<Link href="/dashboard">{t('nav.dashboard')}</Link>
```

### Currency Display
```tsx
const { formatCurrency } = useFormatting();
<span>{formatCurrency(1234.56)}</span>
```

### Date Display
```tsx
const { formatDate } = useFormatting();
<span>{formatDate(new Date())}</span>
```

## Adding a New Feature

### 1. Add translations to both files

**messages/en.json:**
```json
{
  "myFeature": {
    "title": "My Feature",
    "addButton": "Add Item",
    "form": {
      "name": "Name",
      "description": "Description"
    }
  }
}
```

**messages/pt.json:**
```json
{
  "myFeature": {
    "title": "Minha Funcionalidade",
    "addButton": "Adicionar Item",
    "form": {
      "name": "Nome",
      "description": "Descrição"
    }
  }
}
```

### 2. Create your component

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export function MyFeature() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <Button>{t('myFeature.addButton')}</Button>
    </div>
  );
}
```

### 3. Add route in app/[locale]/

```
app/[locale]/my-feature/
├── page.tsx
└── my-feature-client.tsx
```

### 4. Add to navigation

Update `messages/en.json` and `messages/pt.json`:
```json
{
  "nav": {
    "myFeature": "My Feature"  // or "Minha Funcionalidade" in pt.json
  }
}
```

Update `components/navigation.tsx`:
```tsx
const navItems = [
  // ...
  { href: "/my-feature", label: t('nav.myFeature'), icon: MyIcon }
];
```

## Translation Key Checklist

When adding a new page/feature, ensure you have translations for:

- [ ] Page title
- [ ] Page description/subtitle
- [ ] All button labels (save, cancel, edit, delete, add)
- [ ] All form labels
- [ ] Table headers
- [ ] Success/error messages
- [ ] Confirmation dialogs
- [ ] Navigation menu item
- [ ] Any hardcoded text

## Testing Checklist

- [ ] View page in English (`/en/your-page`)
- [ ] View page in Portuguese (`/pt/your-page`)
- [ ] Switch language using the language switcher
- [ ] Check all text is translated (no English in PT, no Portuguese in EN)
- [ ] Test forms and buttons work in both languages
- [ ] Verify currency and date formatting
- [ ] Check navigation links work correctly

## Common Mistakes to Avoid

❌ **Using Next.js Link instead of i18n Link**
```tsx
import Link from 'next/link';  // Wrong!
```
✅ **Use i18n Link**
```tsx
import { Link } from '@/i18n/routing';  // Correct!
```

❌ **Hardcoding text**
```tsx
<button>Save</button>  // Wrong!
```
✅ **Use translations**
```tsx
<button>{t('common.buttons.save')}</button>  // Correct!
```

❌ **Forgetting to add translation to both files**
```json
// Only added to en.json, forgot pt.json
```
✅ **Add to both files**
```json
// Added to both en.json and pt.json
```

❌ **Using hardcoded locale**
```tsx
formatCurrency(value, 'pt')  // Wrong!
```
✅ **Use formatting hook**
```tsx
const { formatCurrency } = useFormatting();
formatCurrency(value)  // Correct!
```

## File Structure Reference

```
app/
├── [locale]/              # All routes go here
│   ├── layout.tsx         # Locale-specific layout
│   ├── page.tsx           # Home page
│   ├── dashboard/
│   ├── students/
│   └── ...
├── api/                   # API routes (no locale)
├── layout.tsx             # Root layout
└── page.tsx               # Root redirect

components/
├── language-switcher.tsx  # Language selector
├── navigation.tsx         # Main navigation
└── ...

i18n/
├── routing.ts             # Locale configuration
└── request.ts             # Message loading

messages/
├── en.json                # English translations
└── pt.json                # Portuguese translations

utils/
├── currency.ts            # Currency formatting
└── date.ts                # Date formatting

hooks/
└── use-formatting.ts      # Formatting hook
```

## Need Help?

- Full documentation: `/docs/i18n.md`
- Implementation plan: `/kiro/i18n-implementation-plan.md`
- Progress tracking: `/kiro/i18n-progress.md`
- next-intl docs: https://next-intl-docs.vercel.app/
