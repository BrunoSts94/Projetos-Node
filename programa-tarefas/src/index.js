import { intro } from '@clack/prompts';
import chalk from 'chalk';
import { mainMenu } from './menu/main.js';

intro(`📜 ${chalk.bgGreen(' Tarefas ')}`);

mainMenu();