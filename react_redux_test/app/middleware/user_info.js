/**
 * 获取当前登录用户的信息
 * @authors yanjixiong
 * @date    2017-03-22 16:24:25
 */

module.exports = function adminInfo(req, res) {
  //var user = req.user;
  var info = Object.assign({}, {
    domain: 'cike.com',
    id: '2885eaeebc414a819c1a78522b19cd30',
    username: 'hebin',
    cnname: '何斌',
    headUrl: 'https://files.chinamye.com.cn/M00/00/99/CgoD-Fpn8hOAclVLAAJD3xWZGHY671.png',
    mobile: '13720169804',
    aliasName: 'hebin@cike.com',
    email: null,
  });
  
  res.json(info);
}
