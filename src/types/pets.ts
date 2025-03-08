export interface Pet {
  id: string;
  name: string;
  type: 'perro' | 'gato' | 'otro';
  breed: string;
  age: number;
  size: string;
  gender: string;
  description: string;
  image_url: string | null;
  status: 'disponible' | 'en_proceso' | 'adoptado';
  created_at?: string;
  updated_at?: string;
  owner_id: string;
}

export interface FilterState {
  search: string;
  type: string;
  size: string;
  gender: string;
  status: string;
  minAge: string;
  maxAge: string;
}

export type PetStatus = Pet['status'];
export type PetType = Pet['type'];
export type PetSize = NonNullable<Pet['size']>;
export type PetGender = NonNullable<Pet['gender']>; 