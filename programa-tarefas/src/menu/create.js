import { isCancel, text, log } from "@clack/prompts";
import { taskmanager } from "../manager/tasks.js";
import { mainMenu } from "./main.js";


export async function createTaskMenu() {
    let name;

    do {
        name = await text({
            message: 'Qual o nome da tarefa?'
        })

        if(taskmanager.tasks.has(name)) {
            log.error(`Tarefa ${name} ja cadastrada, escolha outro nome.`);
        }
    } while( taskmanager.tasks.has(name))

    if(isCancel(name)){
        mainMenu();
        return
    }

    const task = {
        name: name,
        status: 'em andamento',
        createdAt: new Date().toISOString()
    }

    taskmanager.create(task);
    log.success(`Tarefa criada com sucesso!`);

    setTimeout(() => {
        mainMenu();
    }, 1000);
}