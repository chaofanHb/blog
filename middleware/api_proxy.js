
/**
 * api ����
 * @authors yanjixiong
 * @date    2017-03-22 15:43:23
 */

/**
 * ���ɴ�������
 *
 * @param  {[type]} prefix ��·��ƥ��ʱ���ضϣ��˴���Ҫ����ǰ׺
 */
module.exports = function(prefix) {
    return {
        forwardPath: function(req) {
            console.log('proxy path: ', prefix + require('url').parse(req.url).path);
            return prefix + require('url').parse(req.url).path;
        },
        decorateRequest: function(proxyReq, originalReq) {
            //console.log('roles: ', originalReq.user.roles.join(','))

            /*proxyReq.headers['X-CNMYE-USER-ID'] = originalReq.user.id;
            proxyReq.headers['X-CNMYE-USER-NAME'] = originalReq.user.username;
            proxyReq.headers['X-CNMYE-DOMAIN'] = originalReq.user.domain;
            proxyReq.headers['X-CNMYE-ROLES'] = originalReq.user.roles.join(',');*/
            proxyReq.headers['X-CNMYE-USER-ID'] = '2885eaeebc414a819c1a78522b19cd30';
            proxyReq.headers['X-CNMYE-USER-NAME'] = 'hebin';
            proxyReq.headers['X-CNMYE-DOMAIN'] = 'cike.com';
            proxyReq.headers['X-CNMYE-ROLES'] = ['ROLE_DATA_ADMIN','ROLE_DEVELOP_DATA_ADMIN'];
            return proxyReq;
        },
        reqBodyEncoding: null,
    };
}