import { Pet } from '@/types/pets';

interface PetAttributesProps {
  pet: Pet;
}

export function PetAttributes({ pet }: PetAttributesProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Age</p>
        <p className="font-medium">{pet.age || 'Unknown'}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Size</p>
        <p className="font-medium">{pet.size || 'Unknown'}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Gender</p>
        <p className="font-medium">{pet.gender || 'Unknown'}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Type</p>
        <p className="font-medium">{pet.type || 'Unknown'}</p>
      </div>
      {pet.breed && (
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Breed</p>
          <p className="font-medium">{pet.breed}</p>
        </div>
      )}
    </div>
  );
} 