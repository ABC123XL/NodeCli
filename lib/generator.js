// import ora from "ora";

const downLoadGitRepo = require("download-git-repo");
const inquirer = require("@inquirer/prompts");
const util = require("util");
const path = require("path");
const chalk = require("chalk");
const cliProgress = require("cli-progress");
const { getRepoList, getTagList } = require("./http");

// loading
async function wrapLoading(fn, message, ...args) {
  const bar = new cliProgress.SingleBar(
    {
      format: `${message}: {bar}| {percentage}%`,
    },
    cliProgress.Presets.shades_classic
  );
  bar.start(100, 0);
  bar.increment();

  try {
    bar.update(50);
    bar.format = `${message}: {bar} | {percentage}%`;
    const result = await fn(...args);
    bar.update(100);
    bar.format = `${message}: {bar} | {percentage}%`;
    bar.stop();

    return result;
  } catch (error) {
    // spinner.error("Requiest failed, please refetch");
    console.log("node-progress-bars");
  }
}

class Generator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
    this.downLoadGitRepo = util.promisify(downLoadGitRepo);
  }

  // 获取用户模选择的模板
  // 1. 从远端拉去模板信息
  // 2. 用户选择自己已有的下载模板名称
  // 3. 返回用户选择的模板
  async getRepo() {
    const repoList = await wrapLoading(
      getRepoList,
      "watting for fetch template"
    );

    if (!repoList) return;

    const repos = repoList.map((item) => ({
      name: item.name,
      value: item.name,
    }));

    const template = await inquirer.select({
      message: "Please choose a template to create project",
      choices: repos,
    });
    return template;
  }

  // 获取项目模板版本
  async getTag(repoName) {
    const tags = await wrapLoading(
      getTagList,
      "waiting for fetch tag",
      repoName
    );

    const tagsList = tags.map((item) => ({
      name: item.name,
      value: item.name,
    }));

    const tagName = await inquirer.select({
      message: "Please choose a version of template",
      choices: tagsList,
    });
    return tagName;
  }

  // 下载远程项目模板
  async download(repo, tag) {
    const requestUrl = `nodeJsTemplate/${repo}${tag ? `#${tag}` : ""}`;

    await wrapLoading(
      this.downLoadGitRepo,
      "waiting download template",
      requestUrl,
      path.resolve(process.cwd(), this.targetDir)
    );
  }

  // 创建项目
  async create() {
    // 获取模板名称
    const repo = await this.getRepo();

    // 获取 tag 名称
    const tag = await this.getTag(repo);

    await this.download(repo, tag);
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
  }
}

module.exports = Generator;
