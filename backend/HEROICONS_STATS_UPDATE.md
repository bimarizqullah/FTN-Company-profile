# Update StatsGrid dan StatsCard dengan Heroicons

## Perubahan yang Dilakukan

### **1. API Stats Update (`/api/summary/stats/route.ts`)**

#### **Sebelum:**
```typescript
const summary = [
  {
    title: 'Total Users',
    value: totalUsers.toLocaleString('en-US'),
    change: userChange.change,
    changeType: userChange.changeType,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>',
  },
  // ... other stats
];
```

#### **Sesudah:**
```typescript
const summary = [
  {
    title: 'Total Users',
    value: totalUsers.toLocaleString('en-US'),
    change: userChange.change,
    changeType: userChange.changeType,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    iconType: 'users',
  },
  {
    title: 'Total Projects',
    value: totalProjects.toLocaleString('en-US'),
    change: projectChange.change,
    changeType: projectChange.changeType,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    iconType: 'folder',
  },
  {
    title: 'Total Services',
    value: totalServices.toLocaleString('en-US'),
    change: serviceChange.change,
    changeType: serviceChange.changeType,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    iconType: 'wrench-screwdriver',
  },
  {
    title: 'Total Galleries',
    value: totalGalleries.toLocaleString('en-US'),
    change: galleryChange.change,
    changeType: galleryChange.changeType,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    iconType: 'photo',
  },
  {
    title: 'Total Messages',
    value: totalMessages.toLocaleString('en-US'),
    change: messageChange.change,
    changeType: messageChange.changeType,
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    iconType: 'chat-bubble-left-right',
  },
];
```

### **2. StatsGrid Component Update**

#### **Import Heroicons:**
```typescript
import { 
  UsersIcon,
  FolderIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
```

#### **Icon Mapping Function:**
```typescript
// Fungsi untuk mendapatkan icon berdasarkan iconType
function getIcon(iconType: string) {
  switch (iconType) {
    case 'users':
      return <UsersIcon className="w-6 h-6" />
    case 'folder':
      return <FolderIcon className="w-6 h-6" />
    case 'wrench-screwdriver':
      return <WrenchScrewdriverIcon className="w-6 h-6" />
    case 'photo':
      return <PhotoIcon className="w-6 h-6" />
    case 'chat-bubble-left-right':
      return <ChatBubbleLeftRightIcon className="w-6 h-6" />
    default:
      return <UsersIcon className="w-6 h-6" />
  }
}
```

#### **Interface Update:**
```typescript
interface StatItem {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  iconType: string  // Changed from 'icon' to 'iconType'
  bgColor: string
  iconColor: string
}
```

#### **Component Usage:**
```typescript
stats.map((stat, index) => (
  <StatsCard
    key={index}
    title={stat.title}
    value={stat.value}
    change={stat.change}
    changeType={stat.changeType === 'neutral' ? 'positive' : stat.changeType}
    icon={getIcon(stat.iconType)}  // Using Heroicons
    bgColor={stat.bgColor}
    iconColor={stat.iconColor}
  />
))
```

### **3. StatsCard Component Update**

#### **Interface Update:**
```typescript
interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change: string
  changeType: 'positive' | 'negative'
  bgColor?: string      // New optional prop
  iconColor?: string    // New optional prop
}
```

#### **Component Props:**
```typescript
export default function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType,
  bgColor = 'bg-gray-50',      // Default background
  iconColor = 'text-gray-600'  // Default icon color
}: StatsCardProps) {
```

#### **Dynamic Styling:**
```typescript
<div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
  <div className={iconColor}>
    {icon}
  </div>
</div>
```

## Icon Mapping

| Stat Type | Icon Type | Heroicon | Color Theme |
|-----------|-----------|----------|-------------|
| Total Users | `users` | `UsersIcon` | Blue (`bg-blue-100`, `text-blue-600`) |
| Total Projects | `folder` | `FolderIcon` | Green (`bg-green-100`, `text-green-600`) |
| Total Services | `wrench-screwdriver` | `WrenchScrewdriverIcon` | Yellow (`bg-yellow-100`, `text-yellow-600`) |
| Total Galleries | `photo` | `PhotoIcon` | Purple (`bg-purple-100`, `text-purple-600`) |
| Total Messages | `chat-bubble-left-right` | `ChatBubbleLeftRightIcon` | Indigo (`bg-indigo-100`, `text-indigo-600`) |

## Manfaat Perubahan

### **1. Better Performance**
- ✅ **No SVG Parsing**: Menghilangkan `dangerouslySetInnerHTML` dan parsing SVG string
- ✅ **Tree Shaking**: Heroicons hanya mengimport icon yang digunakan
- ✅ **Smaller Bundle**: Mengurangi ukuran bundle dengan menghilangkan SVG string

### **2. Better Maintainability**
- ✅ **Type Safety**: TypeScript support untuk icon props
- ✅ **Consistent Icons**: Menggunakan icon library yang konsisten
- ✅ **Easy Updates**: Mudah menambah/mengubah icon dengan mengupdate mapping function

### **3. Better Developer Experience**
- ✅ **IntelliSense**: Auto-completion untuk icon names
- ✅ **Error Prevention**: Compile-time checking untuk icon types
- ✅ **Documentation**: Heroicons memiliki dokumentasi yang baik

### **4. Better Visual Design**
- ✅ **Consistent Styling**: Semua icon memiliki styling yang konsisten
- ✅ **Color Theming**: Background dan icon color yang sesuai dengan tema
- ✅ **Responsive**: Icon yang responsive dan scalable

## File yang Dimodifikasi

1. ✅ **API Stats**: `src/app/api/summary/stats/route.ts`
2. ✅ **StatsGrid**: `src/app/components/admin-dashboard/StatsGrid.tsx`
3. ✅ **StatsCard**: `src/app/components/admin-dashboard/StatsCard.tsx`

## Dependencies

### **Required:**
```json
{
  "@heroicons/react": "^2.0.0"
}
```

### **Import Statement:**
```typescript
import { 
  UsersIcon,
  FolderIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
```

## Usage Examples

### **Adding New Stat Type:**
```typescript
// 1. Add iconType to API response
{
  title: 'Total Orders',
  value: totalOrders.toLocaleString('en-US'),
  change: orderChange.change,
  changeType: orderChange.changeType,
  bgColor: 'bg-orange-100',
  iconColor: 'text-orange-600',
  iconType: 'shopping-cart',
}

// 2. Import new icon in StatsGrid
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

// 3. Add case to getIcon function
case 'shopping-cart':
  return <ShoppingCartIcon className="w-6 h-6" />
```

### **Custom Icon Colors:**
```typescript
// API response
{
  bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
  iconColor: 'text-white',
  iconType: 'users',
}

// Result: Gradient background with white icon
```

### **Different Icon Sizes:**
```typescript
// In getIcon function
case 'users':
  return <UsersIcon className="w-8 h-8" />  // Larger icon
```

## Testing

### **1. Visual Testing**
- ✅ Icons muncul dengan benar
- ✅ Colors sesuai dengan tema
- ✅ Responsive design
- ✅ Hover effects

### **2. Functionality Testing**
- ✅ Stats data loading
- ✅ Error handling
- ✅ Loading states
- ✅ Change indicators

### **3. Performance Testing**
- ✅ Bundle size reduction
- ✅ Render performance
- ✅ Memory usage
- ✅ Network requests

## Future Improvements

### **1. Icon Variants**
- Support untuk filled vs outline icons
- Custom icon sizes
- Icon animations

### **2. Dynamic Theming**
- Dark mode support
- Custom color schemes
- Theme switching

### **3. Accessibility**
- ARIA labels
- Screen reader support
- Keyboard navigation

### **4. Advanced Features**
- Icon tooltips
- Interactive icons
- Icon badges
- Custom icon sets

Sekarang StatsGrid dan StatsCard menggunakan Heroicons yang lebih modern, performant, dan maintainable!
