const path = require("path");
const fs = require("fs-extra");
const inquirer = require("@inquirer/prompts");
const Generator = require("./generator");

module.exports = async function (name, option) {
  // 判断项目是否存在
  // 获取当前的工作目录
  const cwd = process.cwd();
  const targetDir = path.join(cwd, name);
  const existTargetDir = fs.existsSync(targetDir);
  // 判断当前项目是否存在
  if (existTargetDir) {
    // 是否强制创建
    if (option.force) {
      await fs.remove(targetDir);
    } else {
      // 询问用户是否覆盖
      const answer = await inquirer.select({
        message: "target Direction already exist",
        choices: [
          {
            name: "Overwirte",
            value: "overwirte",
          },
          {
            name: "Cancel",
            value: false,
          },
        ],
      });
      if (!answer) {
        // 用户拒绝则停止
        return;
      } else if (answer === "overwirte") {
        await fs.remove(targetDir);
      }
    }
  }

  // 新建模板
  const generator = new Generator(name, targetDir);
  generator.create();
};
