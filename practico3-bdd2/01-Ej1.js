// -------------------------------------- EJERCICIO 1 --------------------------------------

/*
Muestra todos los datos de la categoría Electrónica con precio mayor a 500
*/

db.productos.aggregate([
    {$match: {
        categoria: 'Electrónica',
        precio: {$gt: 500}
    }}
])

/*
Muestra todos los clientes de España con el estado de venta como Entregado
*/

db.ventas.aggregate([
    {$match: {
        'cliente.pais': 'España',
        estado: 'Entregado'
    }}
])