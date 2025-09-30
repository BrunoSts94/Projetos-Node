import { isCancel, log, select } from "@clack/prompts";
import { taskmanager } from "../manager/tasks.js";
import { mainMenu } from "./main.js";
import { updateTaskMenu } from "./update.js";
import chalk from "chalk";


export async function listTaskMenu() {
    if(taskmanager.tasks.size < 1){
        log.warn('Nenhuma tarefa cadastrada.');
        setTimeout(() => mainMenu(),1500);
        return;
    }

    const selected = await select({
        message: 'Escolha a tarefa que deseja visualizar',
        options: [
            ...taskmanager.toArray().map(({ name, status }) => ({ 
                label: `${taskmanager.colorStatus(status)} ${chalk.white.underline(name)}`,
                value: name
            })),
            { label: 'Menu principal', value: 'main' }
        ] 
    });

    if(isCancel(selected) || selected === 'main'){
        mainMenu();
        return;
    }

    updateTaskMenu(selected);
}