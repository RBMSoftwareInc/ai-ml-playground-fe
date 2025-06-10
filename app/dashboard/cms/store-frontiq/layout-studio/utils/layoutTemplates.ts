import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

// Define the structure of a layout template
interface LayoutTemplate {
  id: string;
  name: string;
  structure: { columns: number[] }[];
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };
  tones: string[];
  storeTypes: string[];
  pageType: string;
  isCustom?: boolean;
}

const layoutTemplates: LayoutTemplate[] = [
  // Home Page Layouts (covering all tones and store types)
  {
    id: 'layout-1',
    name: '1 Column Full Width',
    structure: [{ columns: [100] }],
    icon: ViewColumnIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'Home',
  },
  {
    id: 'layout-9',
    name: '2 Rows Grid',
    structure: [{ columns: [100] }, { columns: [50, 50] }],
    icon: GridViewIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'Home',
  },
  {
    id: 'layout-12',
    name: 'Hero + Grid CTA',
    structure: [{ columns: [100] }, { columns: [33, 34, 33] }],
    icon: ViewCarouselIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'Home',
  },

  // PLP Page Layouts (covering all tones and store types)
  {
    id: 'layout-2',
    name: '1-2-1 Columns',
    structure: [{ columns: [25, 50, 25] }],
    icon: ViewModuleIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'PLP',
  },
  {
    id: 'layout-8',
    name: '1/3/1 Columns',
    structure: [{ columns: [20, 60, 20] }],
    icon: ViewModuleIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'PLP',
  },
  {
    id: 'layout-10',
    name: 'Full Width Banner + Grid',
    structure: [{ columns: [100] }, { columns: [25, 25, 25, 25] }],
    icon: ViewCarouselIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'PLP',
  },
  {
    id: 'layout-11',
    name: 'Infinite Tile Scroll',
    structure: [{ columns: [100] }],
    icon: GridViewIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'PLP',
  },

  // PDP Page Layouts (covering all tones and store types)
  {
    id: 'layout-4',
    name: '2 Columns (30/70)',
    structure: [{ columns: [30, 70] }],
    icon: ViewColumnIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'PDP',
  },
  {
    id: 'layout-5',
    name: '2 Columns (70/30)',
    structure: [{ columns: [70, 30] }],
    icon: ViewColumnIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'PDP',
  },
  {
    id: 'layout-7',
    name: 'Right Sidebar Full',
    structure: [{ columns: [80, 20] }],
    icon: ViewModuleIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'PDP',
  },

  // Search Page Layouts (covering all tones and store types)
  {
    id: 'layout-3',
    name: '3 Columns Equal',
    structure: [{ columns: [33, 34, 33] }],
    icon: GridViewIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'Search',
  },
  {
    id: 'layout-6',
    name: 'Left Sidebar Full',
    structure: [{ columns: [20, 80] }],
    icon: ViewModuleIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'Search',
  },

  // Custom Layout (applicable to all page types)
  {
    id: 'layout-custom',
    name: 'Custom Layout',
    structure: [{ columns: [100] }],
    icon: DashboardCustomizeIcon,
    tones: ['Minimal', 'Elegant', 'Vibrant'],
    storeTypes: ['Fashion', 'Electronics', 'Grocery', 'Home'],
    pageType: 'Home', // Default to Home, but can be used for any page type
    isCustom: true,
  },
];

export default layoutTemplates;