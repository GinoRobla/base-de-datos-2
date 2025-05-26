// -------------------------------------- EJERCICIO 3 --------------------------------------

/*
Muestra los nombres de los productos con su precio y su precio con impuestos
*/

db.productos.aggregate([
    {$project:{
        _id: 0,
        nombre: 1,
        precio: 1,
        precioConImpuesto: {
            $add:[
                '$precio',
                { $multiply: ['$precio', 0.21] }
            ]
        }
    }}
])

/*
Muestra los _id y los nombres de los clientes con el total que pagaron y un descuento del total
*/

db.ventas.aggregate([
    {$project: {
        _id: 1,
        nombreCliente: '$cliente.nombre',
        total: 1,
        descuento: {$multiply: ['$total', 0.10]}
    }}
])