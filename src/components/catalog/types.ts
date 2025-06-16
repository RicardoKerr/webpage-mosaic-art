
export interface Stone {
  id: string;
  name: string;
  category: string;
  rock_type: string;
  finishes: string;
  available_in: string;
  base_color: string;
  characteristics: string;
  image_filename: string;
  image_url?: string; // This is generated dynamically in the component
  enable_on_off?: boolean; // New column to control visibility
}

export interface Filters {
  category: string;
  rock_type: string;
  base_color: string;
  search: string;
}

export type StoneFormData = Omit<Stone, 'id' | 'image_filename' | 'image_url' | 'enable_on_off'>;
