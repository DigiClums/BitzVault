# UI/UX Quick Reference Guide

## Toast Notifications

### Basic Usage
```javascript
Toast.success('Success message');
Toast.error('Error message');
Toast.warning('Warning message');
Toast.info('Info message');
```

### Custom Duration
```javascript
Toast.success('Message', 5000); // Show for 5 seconds
```

## Loading States

### Full Screen Loader
```javascript
Loading.show('Loading...');
// ... async operation
Loading.hide();
```

### Button Loading
```javascript
const button = document.querySelector('#myButton');
setButtonLoading(button, true);  // Start loading
// ... async operation
setButtonLoading(button, false); // Stop loading
```

## Form Validation

```javascript
const input = document.querySelector('#email');
const isValid = input.value.includes('@');
validateInput(input, isValid, 'Please enter a valid email');
```

## Copy to Clipboard

```javascript
copyToClipboard('text to copy', 'Custom success message');
```

## Modal Dialogs

### Simple Modal
```javascript
Modal.show('Title', 'Content here');
```

### Confirm Dialog
```javascript
Modal.confirm('Delete?', 'Are you sure?', () => {
    // User confirmed
    console.log('Confirmed!');
});
```

## Number Formatting

```javascript
formatCurrency(1234.56, 'USDT', 2);  // "1234.56 USDT"
formatNumber(1234567);                // "1,234,567"
```

## Animated Counter

```javascript
const element = document.querySelector('#balance');
animateNumber(element, 0, 1234.56, 1000); // Animate from 0 to 1234.56 in 1 second
```

## CSS Classes

### Animations
- `.fade-in` - Fade in animation
- `.pulse` - Pulsing animation
- `.bounce` - Bouncing animation
- `.flip-in` - Flip in animation
- `.shimmer` - Shimmer loading effect

### Loading States
- `.loader` - Spinning loader
- `.skeleton` - Skeleton loading placeholder
- `.skeleton-text` - Text skeleton
- `.skeleton-title` - Title skeleton
- `.skeleton-card` - Card skeleton

### Utility Classes
- `.ripple` - Ripple effect on click
- `.animate-on-scroll` - Animate when scrolled into view
- `.stagger-item` - Staggered animation for lists

## Common Patterns

### Form Submission with Loading
```javascript
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Validate
    if (!isValid) {
        Toast.error('Please check your input');
        return;
    }
    
    // Show loading
    setButtonLoading(submitBtn, true);
    
    try {
        await api.submitData();
        Toast.success('Success!');
        setTimeout(() => window.location.href = 'next-page.html', 1000);
    } catch (err) {
        Toast.error(err.message);
        setButtonLoading(submitBtn, false);
    }
});
```

### Copy Button
```javascript
function copyAddress() {
    const address = document.getElementById('address').textContent;
    copyToClipboard(address, 'Address copied!');
}
```

### Animated Balance Update
```javascript
async function loadBalance() {
    const balanceEl = document.getElementById('balance');
    try {
        const data = await api.getBalance();
        animateNumber(balanceEl, 0, data.balance, 800);
    } catch (err) {
        Toast.error('Failed to load balance');
    }
}
```

### Skeleton Loading Pattern
```html
<!-- Initial state -->
<div id="content">
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text"></div>
</div>

<script>
async function loadContent() {
    const container = document.getElementById('content');
    try {
        const data = await api.getData();
        container.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.description}</p>
        `;
        container.classList.add('fade-in');
    } catch (err) {
        Toast.error('Failed to load content');
    }
}
loadContent();
</script>
```

## Mobile Responsive Tips

### Breakpoints
```css
/* Mobile */
@media (max-width: 480px) { }

/* Tablet */
@media (min-width: 481px) and (max-width: 768px) { }

/* Desktop */
@media (min-width: 769px) { }
```

### Touch-Friendly Sizes
- Minimum button size: 44x44px
- Minimum tap target: 48x48px
- Comfortable spacing: 8-16px between elements

## Performance Tips

1. **Use CSS animations** instead of JavaScript when possible
2. **Debounce** input handlers:
   ```javascript
   const debouncedSearch = debounce(searchFunction, 300);
   input.addEventListener('input', debouncedSearch);
   ```
3. **Batch DOM updates** to minimize reflows
4. **Use transform and opacity** for animations (GPU-accelerated)

## Accessibility

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Use Tab to navigate, Enter/Space to activate
- Focus states are visible with blue outline

### Screen Readers
- Use semantic HTML
- Add ARIA labels where needed
- Ensure proper heading hierarchy

## Common Issues & Solutions

### Toast not showing?
Make sure `ui-utils.js` is loaded before your script:
```html
<script src="ui-utils.js"></script>
<script src="your-script.js"></script>
```

### Animations not working?
Ensure `enhanced.css` is loaded:
```html
<link rel="stylesheet" href="enhanced.css">
```

### Button loading state stuck?
Always call `setButtonLoading(btn, false)` in catch block:
```javascript
try {
    await operation();
} catch (err) {
    setButtonLoading(btn, false); // Important!
}
```

## Testing Checklist

- [ ] Toast notifications appear and dismiss
- [ ] Loading states show during async operations
- [ ] Forms validate before submission
- [ ] Copy to clipboard works
- [ ] Animations are smooth (60fps)
- [ ] Mobile responsive (test on 320px width)
- [ ] Keyboard navigation works
- [ ] Touch interactions work on mobile
- [ ] No console errors

## Resources

- Full Documentation: `frontend/UI_UX_ENHANCEMENTS.md`
- Demo Page: `http://localhost:3000/ui-demo.html`
- Source Files:
  - `frontend/enhanced.css` - Styles
  - `frontend/ui-utils.js` - JavaScript utilities
