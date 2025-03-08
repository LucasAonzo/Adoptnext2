-- This script adds a variety of pet specimens to test search and filtering functionality

INSERT INTO pets (name, type, breed, age, size, gender, description, image_url, status)
VALUES 
-- Dogs (perros)
('Max', 'perro', 'Labrador Retriever', 3, 'Grande', 'Macho', 'Max is a friendly Labrador with a playful personality. He loves to run and play fetch.', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1', 'disponible'),
('Luna', 'perro', 'Golden Retriever', 2, 'Grande', 'Hembra', 'Luna is a gentle Golden Retriever who loves kids and other animals. She is already house-trained.', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0', 'disponible'),
('Rocky', 'perro', 'German Shepherd', 4, 'Grande', 'Macho', 'Rocky is a loyal German Shepherd. He is very intelligent and learns commands quickly.', 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e', 'disponible'),
('Bella', 'perro', 'Chihuahua', 5, 'Pequeño', 'Hembra', 'Bella is a tiny but brave Chihuahua. She is very affectionate and loves to cuddle.', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee', 'en_proceso'),
('Charlie', 'perro', 'Poodle', 1, 'Mediano', 'Macho', 'Charlie is a young Poodle puppy. He is hypoallergenic and very smart.', 'https://images.unsplash.com/photo-1594284645752-56776a61c77c', 'disponible'),
('Cooper', 'perro', 'Beagle', 6, 'Mediano', 'Macho', 'Cooper is an energetic Beagle with a great nose. He loves to explore and play.', 'https://images.unsplash.com/photo-1611611158876-41699b77a059', 'disponible'),
('Lucy', 'perro', 'Bulldog Francés', 4, 'Pequeño', 'Hembra', 'Lucy is a sweet French Bulldog. She is calm and gets along well with other pets.', 'https://images.unsplash.com/photo-1583337426008-2fef51aa2c09', 'adoptado'),
('Duke', 'perro', 'Rottweiler', 5, 'Grande', 'Macho', 'Duke is a well-trained Rottweiler. He is protective but gentle with his family.', 'https://images.unsplash.com/photo-1567752881298-894bb81f9379', 'disponible'),
('Daisy', 'perro', 'Shih Tzu', 7, 'Pequeño', 'Hembra', 'Daisy is a gentle Shih Tzu who loves to be groomed and pampered.', 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a', 'disponible'),
('Jack', 'perro', 'Boxer', 3, 'Grande', 'Macho', 'Jack is a playful Boxer who is great with kids. He has lots of energy and loves to run.', 'https://images.unsplash.com/photo-1507146426996-ef05306b995a', 'en_proceso'),

-- Cats (gatos)
('Oliver', 'gato', 'Siamese', 2, 'Mediano', 'Macho', 'Oliver is a vocal Siamese with striking blue eyes. He is very social and bonds closely with his humans.', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6', 'disponible'),
('Lola', 'gato', 'Maine Coon', 4, 'Grande', 'Hembra', 'Lola is a majestic Maine Coon with a fluffy coat. She is gentle and patient.', 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131', 'disponible'),
('Leo', 'gato', 'Ragdoll', 3, 'Grande', 'Macho', 'Leo is a laid-back Ragdoll who loves to be held. He goes limp when picked up, just like a ragdoll.', 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce', 'disponible'),
('Kitty', 'gato', 'Scottish Fold', 1, 'Pequeño', 'Hembra', 'Kitty is an adorable Scottish Fold kitten with folded ears. She is playful and curious.', 'https://images.unsplash.com/photo-1494256997604-768d1f608cac', 'en_proceso'),
('Milo', 'gato', 'Bengal', 2, 'Mediano', 'Macho', 'Milo is an active Bengal with a beautiful spotted coat. He loves to climb and explore.', 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8', 'disponible'),
('Chloe', 'gato', 'Persian', 5, 'Mediano', 'Hembra', 'Chloe is a luxurious Persian with a long, silky coat. She enjoys a calm environment.', 'https://images.unsplash.com/photo-1616128618694-96e9e3739a26', 'disponible'),
('Simba', 'gato', 'Orange Tabby', 6, 'Grande', 'Macho', 'Simba is a friendly orange tabby who purrs loudly. He loves attention and treats.', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 'adoptado'),
('Nala', 'gato', 'Calico', 3, 'Pequeño', 'Hembra', 'Nala is a beautiful calico with a tricolor coat. She is independent but affectionate.', 'https://images.unsplash.com/photo-1561948955-570b270e7c36', 'disponible'),
('Felix', 'gato', 'Tuxedo', 2, 'Mediano', 'Macho', 'Felix is a handsome tuxedo cat. He is playful and has excellent hunting instincts.', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6', 'disponible'),
('Sophie', 'gato', 'British Shorthair', 4, 'Mediano', 'Hembra', 'Sophie is a plush British Shorthair with a sweet temperament. She is quiet and dignified.', 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e', 'en_proceso'),

-- Other pets (otros)
('Thumper', 'otro', 'Holland Lop Rabbit', 1, 'Pequeño', 'Macho', 'Thumper is an adorable Holland Lop rabbit with floppy ears. He is gentle and enjoys being petted.', 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308', 'disponible'),
('Coco', 'otro', 'Guinea Pig', 2, 'Pequeño', 'Hembra', 'Coco is a sweet Guinea Pig who loves fresh vegetables. She squeaks with delight when she sees her favorite humans.', 'https://images.unsplash.com/photo-1511694009171-4aa0464947d0', 'disponible'),
('Tweety', 'otro', 'Canary', 3, 'Pequeño', 'Macho', 'Tweety is a bright yellow canary with a beautiful song. He fills the room with cheerful melodies.', 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890', 'disponible'),
('Spike', 'otro', 'Bearded Dragon', 2, 'Pequeño', 'Macho', 'Spike is a friendly bearded dragon who enjoys basking under his heat lamp and eating crickets.', 'https://images.unsplash.com/photo-1597284902002-b783inflame5', 'en_proceso'),
('Bubbles', 'otro', 'Goldfish', 1, 'Pequeño', 'Hembra', 'Bubbles is a beautiful orange goldfish. She is peaceful and mesmerizing to watch.', 'https://images.unsplash.com/photo-1583852780463-a27995a29b53', 'disponible'); 