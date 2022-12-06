function my_func(call, callback){
    let result = call.request.value * call.request.value;
    callback(null, {value: result});
}

module.exports = my_func;