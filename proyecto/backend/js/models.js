const { connectDB } = require('./db'); // importa la función para conectar a la base de datos

// --- Productos ---
async function agregarProducto(producto) {
    const db = await connectDB(); // Conecta a la base de datos
    producto.fechaUltimaActualizacion = new Date(); // Establece la fecha de última actualización
    return await db.collection('productos').insertOne(producto); // Inserta el producto en la colección
}

async function consultarStock(codigo) {
    const db = await connectDB(); // Conecta a la base de datos
    const prod = await db.collection('productos').findOne({ codigo }); // Busca el producto por código
    if (!prod) return null; // Si no se encuentra, retorna null
    return prod.stockActual; // Retorna el stock actual del producto
}

async function productosStockBajo() {
    const db = await connectDB(); // Conecta a la base de datos
    const productos = await db.collection('productos').find({ $expr: { $lt: ["$stockActual", "$stockMinimo"] } }).toArray(); // Busca productos con stock bajo
    return productos; // Retorna los productos con stock bajo
}

// --- Proveedores ---
async function agregarProveedor(proveedor) {
    const db = await connectDB(); // Conecta a la base de datos
    await db.collection('proveedores').insertOne(proveedor); // Inserta el proveedor en la colección
}

// --- Movimientos ---
async function registrarMovimiento(movimiento) {
    const db = await connectDB(); // Conecta a la base de datos
    movimiento.fecha = new Date(); // Establece la fecha del movimiento
    await db.collection('movimientos').insertOne(movimiento); // Inserta el movimiento en la colección
    // Busca el producto por id
    const prod = await db.collection('productos').findOne({ _id: movimiento.productoId });
    if (!prod) return false; // Si no se encuentra el producto, retorna false
    let nuevoStock = prod.stockActual; // Obtiene el stock actual del producto
    if (movimiento.tipo === 'entrada') { // Si es una entrada, aumenta el stock
        nuevoStock += movimiento.cantidad;
    } else { // Si es una salida, disminuye el stock
        nuevoStock -= movimiento.cantidad;
    }
    await db.collection('productos').updateOne( // Actualiza el stock del producto 
        { _id: movimiento.productoId },
        { $set: { stockActual: nuevoStock, fechaUltimaActualizacion: new Date() } }
    );
    return true;
}

async function reporteMovimientos(fechaInicio, fechaFin) {
    const db = await connectDB(); // Conecta a la base de datos
    return db.collection('movimientos').find({
        fecha: { $gte: fechaInicio, $lte: fechaFin }
    }).toArray(); // Retorna los movimientos en el rango de fechas especificado
}

module.exports = {
    agregarProducto,
    consultarStock,
    productosStockBajo,
    agregarProveedor,
    registrarMovimiento,
    reporteMovimientos
};
