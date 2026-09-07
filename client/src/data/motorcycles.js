export const motorcycles = [
  {
    id: 'urban-125', brand: 'FUSION SELECT', model: 'Urban 125', cc: 125, type: 'Urbana',
    uses: ['trabajo', 'diario', 'delivery'], styles: ['urbana'], price: 1395, minMonthly: 55, maxMonthly: 95,
    minDown: 0, image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
    description: 'Ligera, eficiente y práctica para recorridos urbanos.'
  },
  {
    id: 'street-150', brand: 'FUSION SELECT', model: 'Street 150', cc: 150, type: 'Urbana',
    uses: ['trabajo', 'diario', 'delivery'], styles: ['urbana', 'deportiva'], price: 1695, minMonthly: 70, maxMonthly: 115,
    minDown: 100, image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    description: 'Equilibrio entre economía, respuesta y uso diario.'
  },
  {
    id: 'scoot-150', brand: 'FUSION SELECT', model: 'City Scooter 150', cc: 150, type: 'Scooter',
    uses: ['diario', 'trabajo'], styles: ['scooter'], price: 1895, minMonthly: 80, maxMonthly: 125,
    minDown: 100, image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1200&q=80',
    description: 'Comodidad y facilidad para moverte todos los días.'
  },
  {
    id: 'dual-200', brand: 'FUSION SELECT', model: 'Trail 200', cc: 200, type: 'Doble propósito',
    uses: ['trabajo', 'recreacion', 'potencia'], styles: ['doble'], price: 2295, minMonthly: 95, maxMonthly: 155,
    minDown: 200, image: 'https://images.unsplash.com/photo-1525160354320-d8e92641c563?auto=format&fit=crop&w=1200&q=80',
    description: 'Versátil para ciudad, trabajo y caminos más exigentes.'
  },
  {
    id: 'sport-200', brand: 'FUSION SELECT', model: 'Sport 200', cc: 200, type: 'Deportiva',
    uses: ['diario', 'recreacion', 'potencia'], styles: ['deportiva'], price: 2495, minMonthly: 105, maxMonthly: 165,
    minDown: 200, image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1200&q=80',
    description: 'Estética deportiva y mayor respuesta para quien busca emoción.'
  },
  {
    id: 'tour-250', brand: 'FUSION SELECT', model: 'Touring 250', cc: 250, type: 'Touring',
    uses: ['recreacion', 'potencia'], styles: ['deportiva', 'doble'], price: 3195, minMonthly: 140, maxMonthly: 220,
    minDown: 300, image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
    description: 'Más potencia, confort y presencia para recorridos largos.'
  }
]
