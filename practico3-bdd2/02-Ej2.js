// -------------------------------------- EJERCICIO 2 --------------------------------------

/*
Muestra diferentes tablas por cada categoria donde muestra el precio máximo, mínimo y promedio de cada uno
*/

db.productos.aggregate([
    {$group: {
        _id: '$categoria',
        maxPrecio: {$max: '$precio'},
        minPrecio: {$min: '$precio'},
        promedioPrecio: {$avg: '$precio'}
    }},
    {$sort:{maxPrecio: -1}}
])

/*
Muestra diferentes tablas por cada pais donde muestra la cantidad de transacciones hechas y el total ganado
*/

db.ventas.aggregate([
    {$group: {
        _id: '$cliente.pais',
        cantTransacciones: {$sum: '$cantidad'},
        totalObtenido: {$sum: '$total'}
    }},
    {
        $sort: {cantTransacciones: -1, totalObtenido: -1}
    }
])