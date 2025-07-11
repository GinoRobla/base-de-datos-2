const { ObjectId } = require('mongodb');

const {
    agregarProducto,
    consultarStock,
    productosStockBajo,
    agregarProveedor,
    registrarMovimiento,
    reporteMovimientos
} = require('./models');

async function demo() {
    // Ejemplo: agregar un producto
    // 1. Agregar un producto y guardar el _id
    const resultado = await agregarProducto({
        codigo: 'PROD001',
        nombre: 'Laptop HP',
        categoria: 'Electrónicos',
        precio: 799.99,
        stockActual: 5,
        stockMinimo: 6,
        proveedorId: null
    });
    const productoId = resultado.insertedId;
    console.log('Producto agregado con _id:', productoId);

    // 2. Consultar stock
    const stock = await consultarStock('PROD001');
    console.log('Stock actual PROD001:', stock);

    // 3. Productos con stock bajo
    const bajos = await productosStockBajo();
    console.log('Productos con stock bajo:', bajos);

    // 4. Agregar proveedor
    await agregarProveedor({
        nombre: 'Distribuidora Tech',
        contacto: 'Juan López',
        telefono: '+1234567890',
        email: 'ventas@distritech.com',
        productosOfrecidos: ['PROD001', 'PROD002']
    });
    console.log('Proveedor agregado');

    // 5. Registrar movimiento usando el _id real del producto
    const movOk = await registrarMovimiento({
        productoId: productoId,
        tipo: 'entrada',
        cantidad: 10,
        motivo: 'Compra a proveedor',
        usuario: 'admin'
    });
    console.log('Movimiento registrado:', movOk);

    // 6. Reporte de movimientos
    const desde = new Date('2024-01-01');
    const hasta = new Date();
    const movimientos = await reporteMovimientos(desde, hasta);
    console.log('Movimientos:', movimientos);
}
demo().then(() => process.exit()); // cuando la función demo termine, cierra el proceso