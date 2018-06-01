
//1.resolve继续执行then，reject放弃执行then   2.resolve(xx)的xx将作为then里面fun的参数
function test(resolve, reject) {
    //0-2随机数
    var timeOut = Math.random() * 2;
    console.log('set timeout to: ' + timeOut + ' seconds.');
    setTimeout(function () {
        if (timeOut < 1) {
            console.log('call resolve()...');
            resolve('200 OK');
        } else {
            console.log('call reject()...');
            reject('timeout in ' + timeOut + ' seconds.');
        }
    }, timeOut * 3000);
}


var p1 = new Promise(test);
var p2 = p1.then(function (result) {
    console.log('SUCCESS: ' + result);
});
var p3 = p2.catch(function (reason) {
    console.log('FAIL: ' + reason);
});