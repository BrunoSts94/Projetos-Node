import { isCancel, log, text, select } from "@clack/prompts";
import { taskmanager } from "../manager/tasks.js";
import { listTaskMenu } from "./list.js";
import chalk from "chalk";


export async function updateTaskMenu(taskName){
    const task = taskmanager.tasks.get(taskName);

    const formatedDate = new Date(task.createdAt).toLocaleString();
    const status = taskmanager.colorStatus(task.status);

    log.info([
        `Tarefa: ${task.name}`,
        `Status: ${status}`,
        `Data de criacao: ${chalk.bgGrey(formatedDate)}`
    ].join('\n'));

    const selected = await select({
        message: 'Escolha o que deseja fazer',
        options: [
            { label: 'Alterar nome', value: 'name' },
            { label: 'Alterar status', value: 'status' },
            { label: 'Deletar', value: 'delete' },
            { label: 'Voltar', value: 'back' },
        ] 
    });

    if(isCancel(selected)) {
        listTaskMenu();
        return;
    }

    switch(selected){
        case 'delete':{
            taskmanager.tasks.delete(taskName);
            taskmanager.save();
        }
        case 'back': {
            listTaskMenu();
            return;
        }
        case 'name': {
            const oldTaskName = task.name;

            const newTaskName = await text({
                message: 'Digite o novo nome da tarefa',
                validate(input){
                    if(taskmanager.tasks.has(input)){
                        return `Já existe uma tarefa com este nome.`;
                    } 
                }
            });

            if(isCancel(newTaskName)){
                updateTaskMenu(oldTaskName);
                return;
            }

            taskmanager.tasks.delete(oldTaskName);
            const updatedTask = {...task, name: newTaskName};
            taskmanager.tasks.set(newTaskName, updatedTask);
            taskmanager.save();
            updateTaskMenu(newTaskName);
            return;
        }
        case 'status': {
            const taskStatus = [
                'em andamento',
                'concluida',
                'cancelada'
            ]
            const options = taskStatus
            .filter(status => status !== task.status)
            .map(status => ({ label: status, value: status }));

            const status = await select({
                message: 'Escolha o novo status da tarefa',
                options
            });

            if(isCancel(status)){
                updateTaskMenu(taskName);
                return;
            }

            taskmanager.tasks.set(taskName, {...task, status});
            taskmanager.save();
            updateTaskMenu(taskName);
            return;
        }
    }
}