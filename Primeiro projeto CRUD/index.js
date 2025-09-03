const express = require('express')
const uuid = require('uuid')

const app = express()
app.use(express.json())

const users = []

const checkUserId = (request, response, next)=>{
    const {id:id} = request.params

    const index = users.findIndex(user => user.id === id)
    if(index < 0){ 
        return response.status(404).json({message: 'User not found'})
    }

    request.userIndex = index
    request.userId = id

    next()
}
                                       //Criando rotas
// ROTA GET para mostrar os usuarios
app.get('/users', (request, response) => {
    return response.json(users)
})


// ROTA POST, para adicionar usuarios no array/banco de dados. Deve ser criado uma requisição/request no insomnia primeiro
app.post('/users', (request, response) => {
    const {name: name, age: age} = request.body
    
    const user = { id:uuid.v4(), name:name, age:age}

    users.push(user)

    return response.status(201).json(user)
})


// ROTA PUT, para atualizar/alterar usuarios
app.put('/users/:id', checkUserId, (request, response) => {  
    const {name:name, age:age} = request.body  
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, name, age }  

    users[index] = updateUser 

    return response.json(updateUser)
})


// ROTA DELETE, para deletar usuarios
app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index,1)
    return response.status(201).json()
})


app.listen(3000, () => {
    console.log('😁 Server rodando na porta 3000')
})