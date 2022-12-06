const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./bidirectional.proto";
var protoLoader = require("@grpc/proto-loader");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const bidirectionalproto = grpc.loadPackageDefinition(packageDefinition).bidirectional;

function echo_message(call){
    console.log("Server processing gRPC bidirectional streaming.");
    //client로부터 message가 왔으면 message를 그대로 전송
    call.on('data', function(request){
        call.write({message: request.message});
    })
    //client로 부터 모든 요청이 도착했으면 모든 message를 처리했다고 알림
    call.on('end', function(){
        console.log("All messages were processed")
        call.end()
    })
}

function main(){
    var server = new grpc.Server();
    server.addService(bidirectionalproto.Bidirectional.service, {GetServerResponse: echo_message});
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log("Starting server. Listening on port 50051.");
        server.start();
    });
}

main();