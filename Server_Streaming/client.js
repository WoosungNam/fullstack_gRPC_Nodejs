const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./serverstreaming.proto";
var protoLoader = require("@grpc/proto-loader");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const serverstreamingproto = grpc.loadPackageDefinition(packageDefinition).serverstreaming;

function main(){
    let client = new serverstreamingproto.ServerStreaming(
        "localhost:50051",
        grpc.credentials.createInsecure()
    );
    
    //request 값을 임의로 설정
    let input = 10;
    let call = client.GetServerResponse({value: input});
    //요청에 대한 call에 대해서 data라면 response된 message를 출력
    call.on('data', function(response){
        console.log("[server to client] " + response.message);
    })
    //end라면 모든 message가 도착했다고 알림
    call.on('end', function(){
        console.log("All messages arrived");
    })
}

main();