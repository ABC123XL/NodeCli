#! /usr/bin/env node
const program = require("commander");

// 定义命令和参数
// create命令
program
  .command("create <app-name>")
  .description("create a node template project")
  .option("-f, --force", "overwirte target directory if ite exist")
  .action((name, option) => {
    require("../lib/create")(name, option);
  });

// 解析用户执行命令的传入参数
program.parse(process.argv);
