//필요한 moudle require, proto-loader module을 통해 dynamic하게 proto file을 생성하기 위해 proto file 위치로 PROTO_PATH 설정
const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./hello_grpc.proto";
var protoLoader = require("@grpc/proto-loader");

//protobuf loader options을 설정
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

//PROTO_PATH와 options로 proto file을 가져오며 package를 정의
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
//package 정의를 통해 grpc load -> grpc객체 생성
const hellogrpcProto = grpc.loadPackageDefinition(packageDefinition).myservice;

//server에서 사용하기 위해 정의한 함수를 require
const my_func = require('./hello_grpc.js');

function main() {
    //server생성
    var server = new grpc.Server();
    //server에 service추가
    server.addService(hellogrpcProto.MyService.service, {MyFunction: my_func});
    //server bind 및 start
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log("Starting server. Listening on port 50051.");
        server.start();
    });
}

main();