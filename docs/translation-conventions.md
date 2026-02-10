# Translation Key Conventions

## Naming Standards

### 1. Use camelCase for Keys

✅ **Good:**
```json
{
  "monthlyReceipts": "...",
  "extraReceipts": "...",
  "studentDetails": "..."
}
```

❌ **Bad:**
```json
{
  "monthly-receipts": "...",
  "extra_receipts": "...",
  "StudentDetails": "..."
}
```

### 2. Hierarchical Structure

Organize translations by feature/module:

```json
{
  "dashboard": {
    "title": "Dashboard",
    "cards": {
      "initialBalance": "Initial Balance",
      "totalRevenues": "Total Revenues"
    },
    "dre": {
      "title": "Income Statement",
      "revenues": "Revenues"
    }
  }
}
```

### 3. Common Elements

Use `common` namespace for shared UI elements:

```json
{
  "common": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel",
      "edit": "Edit",
      "delete": "Delete"
    },
    "labels": {
      "name": "Name",
      "email": "Email",
      "date": "Date"
    },
    "messages": {
      "loading": "Loading...",
      "success": "Success",
      "error": "Error"
    }
  }
}
```

### 4. Feature-Specific Keys

Group by feature with nested structure:

```json
{
  "students": {
    "title": "Students",
    "addStudent": "Add Student",
    "editStudent": "Edit Student",
    "form": {
      "name": "Student Name",
      "email": "Email",
      "phone": "Phone"
    },
    "messages": {
      "createSuccess": "Student created successfully",
      "deleteConfirm": "Are you sure you want to delete this student?"
    }
  }
}
```

## Key Categories

### Buttons
```json
"common.buttons.{action}"
```
Examples: `save`, `cancel`, `edit`, `delete`, `add`, `create`, `update`, `confirm`, `close`

### Labels
```json
"common.labels.{field}"
```
Examples: `name`, `email`, `date`, `value`, `description`, `status`, `actions`

### Messages
```json
"{feature}.messages.{type}"
```
Examples: `createSuccess`, `updateSuccess`, `deleteSuccess`, `deleteConfirm`, `error`

### Form Fields
```json
"{feature}.form.{field}"
```
Examples: `students.form.name`, `expenses.form.description`

### Page Elements
```json
"{feature}.{element}"
```
Examples: `dashboard.title`, `students.addStudent`, `expenses.totalExpenses`

## Translation Patterns

### Action Buttons
```json
{
  "add": "Add",
  "addStudent": "Add Student",
  "addExpense": "Add Expense"
}
```

### Confirmation Messages
```json
{
  "confirmDelete": "Are you sure you want to delete this item?",
  "confirmDeleteStudent": "Are you sure you want to delete this student?"
}
```

### Success Messages
```json
{
  "createSuccess": "Created successfully",
  "studentCreated": "Student created successfully",
  "expenseCreated": "Expense created successfully"
}
```

### Form Labels
```json
{
  "name": "Name",
  "studentName": "Student Name",
  "expenseName": "Expense Name"
}
```

## Parameterized Translations

Use parameters for dynamic content:

```json
{
  "welcome": "Welcome {name}!",
  "itemsCount": "You have {count} items",
  "dateRange": "From {from} to {to}",
  "cardTitle": "Extra Receipts {year}"
}
```

Usage:
```tsx
t('welcome', { name: 'John' })
t('itemsCount', { count: 5 })
t('dateRange', { from: '01/01/2026', to: '31/12/2026' })
t('cardTitle', { year: 2026 })
```

## Pluralization

For items that need plural forms:

```json
{
  "student": "Student",
  "students": "Students",
  "item": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
}
```

## File Organization

### Structure in en.json and pt.json

```json
{
  "common": {
    "buttons": { ... },
    "labels": { ... },
    "status": { ... },
    "messages": { ... },
    "validation": { ... }
  },
  "nav": { ... },
  "dashboard": { ... },
  "students": { ... },
  "monthlyReceipts": { ... },
  "extraReceipts": { ... },
  "expenses": { ... },
  "settings": { ... },
  "admin": { ... },
  "auth": { ... }
}
```

## Best Practices

### 1. Be Specific When Needed

✅ **Good:**
```json
{
  "students.deleteConfirm": "Are you sure you want to delete this student?",
  "expenses.deleteConfirm": "Are you sure you want to delete this expense?"
}
```

❌ **Bad (too generic):**
```json
{
  "deleteConfirm": "Delete?"
}
```

### 2. Reuse Common Translations

✅ **Good:**
```tsx
<Button>{t('common.buttons.save')}</Button>
<Button>{t('common.buttons.cancel')}</Button>
```

❌ **Bad (duplicating):**
```json
{
  "students.save": "Save",
  "expenses.save": "Save",
  "settings.save": "Save"
}
```

### 3. Keep Translations Synchronized

Always update both `en.json` and `pt.json` together.

### 4. Use Meaningful Names

✅ **Good:**
```json
{
  "dashboard.cards.initialBalance": "Initial Balance",
  "dashboard.cards.totalRevenues": "Total Revenues"
}
```

❌ **Bad:**
```json
{
  "dashboard.card1": "Initial Balance",
  "dashboard.card2": "Total Revenues"
}
```

### 5. Group Related Items

✅ **Good:**
```json
{
  "students": {
    "form": {
      "name": "Name",
      "email": "Email",
      "phone": "Phone"
    }
  }
}
```

❌ **Bad:**
```json
{
  "students": {
    "formName": "Name",
    "formEmail": "Email",
    "formPhone": "Phone"
  }
}
```

## Validation Messages

```json
{
  "common": {
    "validation": {
      "required": "This field is required",
      "invalidEmail": "Invalid email address",
      "invalidDate": "Invalid date",
      "minLength": "Minimum {min} characters",
      "maxLength": "Maximum {max} characters",
      "minValue": "Minimum value: {min}",
      "maxValue": "Maximum value: {max}"
    }
  }
}
```

## Error Messages

```json
{
  "common": {
    "errors": {
      "generic": "An error occurred",
      "network": "Network error",
      "notFound": "Not found",
      "unauthorized": "Unauthorized",
      "serverError": "Server error"
    }
  },
  "{feature}": {
    "errors": {
      "fetchError": "Error loading {feature}",
      "createError": "Error creating {feature}",
      "updateError": "Error updating {feature}",
      "deleteError": "Error deleting {feature}"
    }
  }
}
```

## Status Labels

```json
{
  "common": {
    "status": {
      "active": "Active",
      "inactive": "Inactive",
      "paid": "Paid",
      "pending": "Pending",
      "cancelled": "Cancelled"
    }
  }
}
```

## Checklist for New Translations

When adding a new feature, ensure you have:

- [ ] Page title
- [ ] Page description/subtitle
- [ ] All button labels
- [ ] All form field labels
- [ ] Table column headers
- [ ] Success messages
- [ ] Error messages
- [ ] Confirmation dialogs
- [ ] Status labels
- [ ] Navigation menu item
- [ ] Any tooltips or help text

## Review Checklist

Before committing translation changes:

- [ ] Both `en.json` and `pt.json` are updated
- [ ] Keys follow camelCase convention
- [ ] Keys are properly nested
- [ ] No duplicate keys
- [ ] Translations are contextually appropriate
- [ ] Parameters are used correctly
- [ ] JSON is valid (no syntax errors)
- [ ] Tested in both languages
