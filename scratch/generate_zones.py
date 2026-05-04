import yaml
import os
import random

def generate_zone(zone_prefix, zone_name, desc_variations, name_variations, rows, cols):
    rooms = []
    
    for r in range(rows):
        for c in range(cols):
            room_id = f"{zone_prefix}_{r}_{c}"
            name = random.choice(name_variations)
            desc = random.choice(desc_variations)
            
            exits = []
            if r > 0:
                exits.append({"direction": "north", "targetRoomId": f"{zone_prefix}_{r-1}_{c}"})
            if r < rows - 1:
                exits.append({"direction": "south", "targetRoomId": f"{zone_prefix}_{r+1}_{c}"})
            if c < cols - 1:
                exits.append({"direction": "east", "targetRoomId": f"{zone_prefix}_{r}_{c+1}"})
            if c > 0:
                exits.append({"direction": "west", "targetRoomId": f"{zone_prefix}_{r}_{c-1}"})
                
            rooms.append({
                "id": room_id,
                "name": f"{name}",
                "description": desc,
                "exits": exits
            })
            
    return rooms

# --- Bosque de los Ecos ---
bosque_names = [
    "Espesura del Bosque de los Ecos",
    "Sendero Enmarañado",
    "Claro de Sombras Danzantes",
    "Arboleda Silenciosa",
    "Raíces Retorcidas",
    "Rincón de los Ecos Perdidos",
    "Paso Cubierto de Musgo"
]

bosque_descs = [
    "Los inmensos robles grises bloquean casi por completo la luz del sol. El aire huele a pino antiguo y humedad.",
    "Las sombras parecen moverse de forma antinatural entre los troncos oscuros. Una brisa gélida susurra a lo lejos.",
    "Un claro circular rodeado de vegetación espinosa. El suelo está cubierto por una alfombra de hojas crujientes de color violeta.",
    "Enormes raíces emergen del suelo como serpientes de madera, dificultando el paso. El silencio aquí es opresivo y pesado.",
    "Lianas colgantes forman una cortina natural en este tramo del bosque. Se pueden escuchar ecos distantes de conversaciones que nunca ocurrieron.",
    "Un antiguo monolito de piedra roto descansa entre la maleza, devorado por el musgo luminoso. El entorno parece observar cada uno de tus movimientos."
]

# --- Llanuras de Ámbar ---
llanuras_names = [
    "Campos de Ámbar",
    "Llanura Abierta",
    "Pastos Altos",
    "Loma Suave",
    "Tierras de Pastoreo Salvaje",
    "Colina de Viento Cálido"
]

llanuras_descs = [
    "Un vasto océano de hierba dorada se extiende hasta donde alcanza la vista. El viento peina las espigas creando olas de color ámbar.",
    "El cielo abierto y despejado domina este paisaje llano. Pequeñas madrigueras salpican el suelo arcilloso.",
    "La hierba aquí crece casi hasta la cintura, ocultando lo que podría acechar a nivel del suelo. El olor a heno seco inunda el aire cálido.",
    "Una suave elevación del terreno ofrece una vista panorámica de las interminables llanuras doradas. El zumbido de los insectos es constante.",
    "Rocas blanquecinas emergen esporádicamente entre el pasto alto, proporcionando algo de sombra escasa en este mar de hierba."
]

# Generate Bosque (8x8 = 64 rooms)
bosque_rooms = generate_zone("bosque", "Bosque de los Ecos", bosque_descs, bosque_names, 8, 8)

# Connect to Villaclara (Link bosque_0_4 to villaclara_pozo or something)
bosque_rooms[0]["name"] = "Entrada al Bosque de los Ecos"
bosque_rooms[0]["description"] = "El borde del bosque marca una frontera abrupta entre la civilización y lo salvaje. Un camino tenue conduce hacia la plaza de Villaclara al norte."
bosque_rooms[0]["exits"].append({"direction": "north", "targetRoomId": "villaclara_sur"})

# Generate Llanuras (8x8 = 64 rooms)
llanuras_rooms = generate_zone("llanuras", "Llanuras de Ámbar", llanuras_descs, llanuras_names, 8, 8)

# Connect to Villaclara (Link llanuras_0_0 to villaclara_campo_norte)
llanuras_rooms[0]["name"] = "Borde de las Llanuras"
llanuras_rooms[0]["description"] = "El inicio de las vastas llanuras doradas. Hacia el sur, se puede ver la entrada a los campos norteños de Villaclara."
llanuras_rooms[0]["exits"].append({"direction": "south", "targetRoomId": "villaclara_campo_norte"})

# Write areas
def save_yaml(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        yaml.dump(data, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

save_yaml('packages/engine/data/areas/bosque_ecos/rooms.yml', bosque_rooms)
save_yaml('packages/engine/data/areas/llanuras_ambar/rooms.yml', llanuras_rooms)

print(f"Generadas {len(bosque_rooms)} habitaciones para el Bosque.")
print(f"Generadas {len(llanuras_rooms)} habitaciones para las Llanuras.")
