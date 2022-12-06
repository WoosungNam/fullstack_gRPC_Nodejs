//server와 동일한 과정
const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./hello_grpc.proto";
var protoLoader = require("@grpc/proto-loader");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const hellogrpcProto = grpc.loadPackageDefinition(packageDefinition).myservice;

//proto file의 Myservice를 사용할 수 있는 client 생성
const client = new hellogrpcProto.MyService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

let input = 4;

//client로 server에서 정의된 함수를 원격에서 호출
client.MyFunction({value: input}, function (err, response){
    console.log("gRPC result: ", response.value);
});