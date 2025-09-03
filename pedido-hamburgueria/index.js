const express = require('express')
const uuid = require('uuid')

const app = express()
app.use(express.json())

const orders = []

const showMethodUrl = (request, response, next) => {
    const method = request.method
    const url = request.url
    console.log(`Methodo: ${method}, url: ${url}`)
    next()
}


const checkOrderId = (request, response, next) => {
    const {id} = request.params
    const index = orders.findIndex(orders => orders.id === id)

    if(index < 0){
        return response.status(404).json({message: 'order not found'})
    }

    request.orderIndex = index
    request.orderId = id
    next()
}

//Rotas
//GET geral
app.get('/order', showMethodUrl, (request, response) => {
    return response.json(orders)
})

//GET especifico
app.get('/order/:id', showMethodUrl, checkOrderId, (request, response) => {
    const index = request.orderIndex
    const especificOrder = orders[index]
    

    return response.json(especificOrder)
})


//POST - criar
app.post('/order', showMethodUrl, (request, response) => {
    const {order, clientName, price} = request.body

    const client = { id:uuid.v4(), order, clientName, price, status: "Em preparação"}

    orders.push(client)

    return response.status(201).json(client)
})

//PUT - alterar
app.put('/order/:id', showMethodUrl, checkOrderId, (request, response) => {
    const {order, clientName, price} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = {id, order, clientName, price}


    orders[index] = updateOrder

    return response.json(updateOrder)
})

//DELETE
app.delete('/order/:id', showMethodUrl, checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders.splice(index,1)
    return response.status(201).json()
})


//PATCH - alteração do status do pedido
app.patch('/order/:id', showMethodUrl, checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders[index].status = "Pronto"  // 👈 altera direto o status

    return response.json(orders[index])
})



//Definição de porta
app.listen(3000, () => {
    console.log('🚀 Server rodando na porta 3000')
})