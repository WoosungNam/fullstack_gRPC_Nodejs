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

function main(){
    let client = new bidirectionalproto.Bidirectional(
        "localhost:50051",
        grpc.credentials.createInsecure()
    );
    
    let call = client.GetServerResponse();

    //request 횟수만큼 message를 생성해서 server에게 전송
    let info;
    //request 횟수는 임의로 설정
    let request = 5;
    for(let i = 0; i < request; i++){
        info = "message #" + String(i+1);
        console.log("[client to server] " + info);
        call.write({message: info});
    }
    //모든 message를 전송했으면 end()호출
    call.end();

    //요청에 대한 call에 대해서 data라면 response된 message를 출력
    call.on('data', function(response){
        console.log("[server to client] " + response.message);
    })
    //end라면 모든 message가 도착했다고 알림
    call.on('end', function(){
        console.log("All messages were processed");
    })
}

main();