const { default: axios } = require("axios");

axios.interceptors.response.use((res) => {
  return res.data;
});

// 获取模板列表
async function getRepoList() {
  return axios.get("https://api.github.com/orgs/nodeJsTemplate/repos");
}

// 获取版本信息
async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/nodeJsTemplate/${repo}/tags`);
}

module.exports = {
  getRepoList,
  getTagList,
};
