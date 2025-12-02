export interface Widget {
  type: 'Widget';
  title: string;
  description: string;
  styles: { background: string; padding: string };
  apiConfig?: string;
}

export interface Fragment {
  type: 'Fragment';
  fragmentId: string;
  name: string;
  config: Record<string, any>;
}

export interface Slot {
  id: string;
  content: Widget | Fragment | null;
}

export interface Section {
  id: string;
  type: 'Header' | 'Content' | 'Footer' | 'Sidebar' | 'Promo' | 'Custom';
  slots: Slot[];
}

export interface Layout {
  sections: Section[];
}

export interface LayoutData {
  storeId: string;
  pageType: string;
  designTone: string;
  storeType: string;
  layout: Layout;
}