import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import chalk from 'chalk';

const filePath = path.join('./tasks.json');

if(!existsSync(filePath)){  //checagem para saber se o arquivo existe, caso ele não exista, será criado
    writeFileSync(filePath, JSON.stringify([]), 'utf-8');
}

const data = readFileSync(filePath, 'utf-8'); //leitura do arquivo
const parsed = JSON.parse(data); 

const tasks = new Map(parsed.map(task => [task.name, task]));

export const taskmanager = {
    tasks,
    save() {
        const data = this.toArray();
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    },
    create(task) {
        tasks.set(task.name, task);
        this.save();
    },
    toArray() {
        return Array.from(tasks.values());
    }, 
    colorStatus(status){
        switch (status) {
            case 'em andamento':{ 
                return chalk.bgHex('#FFA500')(` ${status} `);
            }
            case 'concluida':{ 
                return chalk.bgGreen(` ${status} `);
            }
            case 'cancelada':{ 
                return chalk.bgRed(` ${status} `);
            }
            default:
                return chalk.bgWhite(` ${status} `);
        }
    }
}